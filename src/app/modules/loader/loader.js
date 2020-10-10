import React, { Component, Fragment } from "react";
import styles from "./loader.scss";
import { loaderPageStates } from "../../constants/loaderConstants";
import { Transition, Spring } from "react-spring/renderprops";
import Div from "Common/components/div";
import { withRouter, matchPath } from "react-router";
import { CookieService } from "Common/utils/cookieService";
import BackgroundAnimator from "../header/backgroundAnimator";
import { getRequestAnimationFrame, cancelAnimationFrame } from 'Common/utils';

const assetsImages = require.context(
  `../../../assets/images`,
  false,
  /.*\.png$|jpg$|jpeg$/
);
const assetTechnologyImages = require.context(
  `../../../assets/images/technology`,
  false,
  /.*\.png$|jpg$/
);

const assetsBackgroundImages = require.context(
  '../../../assets/images/background',
  false,
  /.*\.png$|jpg$/
);

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentLoadedPercentage: 0,
      totalItems: 0,
      showBackground: true,
      pageState: loaderPageStates.IS_LOADING,
      disableIntro: true
    };

    this.lastUpdated = 0;
    this.itemsLoaded = 0;
  }

  componentDidMount() {
    this.getTotalLoadingItems();
  }

  getTotalLoadingItems = () => {
    const { location } = this.props;
    const images = Array.from(document.images);


    // Todo loop once
    this.getImagesFromContext(assetsImages).map(image =>
      images.push(this.preloadImage(image))
    );
    this.getImagesFromContext(assetTechnologyImages).map(image =>
      images.push(this.preloadImage(image))
    );
    import("Modules/landing/landing").then(Landing => {
      this.incrementLoading();
    }); // increment manually being called.
    import("Modules/projectDetailsPage").then(ProjectDetailsPage => { }); // Asyncronysly complete on background. //Todo unless if its the projects page .. use routeMatch

    this.setState({ totalItems: images.length + 3 });
    let areImagesLoaded = true;

    // TODO use function and pass onto the preLoaded image function
    if (images)
      images.forEach(element => {
        element.onload = this.incrementLoading;
        element.onerror = this.incrementLoading;
        if (areImagesLoaded) {
          areImagesLoaded = element.complete;
        }
      });

    if (areImagesLoaded) {
      this.completeLoading(true); // immediatly load page.
    } else {
      const introAlreadyShown = CookieService.get("INTRO_COMPLETED");
      const match = matchPath(location.pathname, {
        path: "/project/:projectSlug?",
        exact: true,
        strict: false
      });
      
      if (match && introAlreadyShown) {
        // Todo also check if intro animation is done or not ... if not the make this condition false
        this.completeLoading(true); // immediatly load page.
      } else {        
        this.animationFrameRequest = getRequestAnimationFrame(this.valuateProgress)
      }
    }
  };

  // This function is called every 300 millisecond to update the progress bar
  // Because if we keep updating the progress bar on callback of items loaded then the animation suffers
  valuateProgress = timeStamp => {
    const { totalItems } = this.state;
    const isLastPercentage = totalItems - this.itemsLoaded <= 2;
    const updateStateAfter = isLastPercentage ? 600 : 400; //600 ms for the last 2 percentage

    if (timeStamp - this.lastUpdated >= updateStateAfter /*ms*/) {
      this.lastUpdated = timeStamp;

      // manually incrementing the progress for the last 2 percent to make a seemless animation.
      if (isLastPercentage) {
        this.itemsLoaded = this.itemsLoaded + 1;
      }

      this.setState({
        contentLoadedPercentage: Math.trunc(
          (this.itemsLoaded / totalItems) * 100
        )
      });
    }

    if (this.itemsLoaded >= totalItems) {
      this.completeLoading();
      cancelAnimationFrame(this.animationFrameRequest)
      return;
    } else {
      this.animationFrameRequest = getRequestAnimationFrame(this.valuateProgress);
    }
  };

  //---------------------------------------- Helper Functions
  // TODO move to utils file and change preloadImage funciton name
  getImagesFromContext = images => {
    const extractedImages = [];
    images.keys().forEach(key => {
      extractedImages.push(images(key));
    });

    return extractedImages;
  };

  preloadImage = src => {
    // console.log('Preloading :', src);
    const image = new Image();
    image.src = src;
    // image.complete;
    return image;
  };

  /*--------------------------------------Loading Functions */
  incrementLoading = () => {
    this.itemsLoaded = this.itemsLoaded + 1;
  };

  completeLoading = showImmediately => {
    const { contentLoadedPercentage, disableIntro } = this.state;
    const introAlreadyShown = CookieService.get("INTRO_COMPLETED");

    //Laoding background images in the background, without a loader tracking progress
    const images = [];
    this.getImagesFromContext(assetsBackgroundImages).map(image =>
      images.push(this.preloadImage(image))
    );


    if (showImmediately) {
      return this.setState({
        pageState: loaderPageStates.SHOW_PAGE,
        showBackground: false
      });
    }

    if (contentLoadedPercentage != 100)
      // if by chance its not 100 then show 100 on page
      this.setState({ contentLoadedPercentage: 100 });

    this.setState({
      pageState: loaderPageStates.COMPLETED_LOADING // complete loading animation takes around 400 ms to hide
    });

    // so created a timeout to not show content immediately
    setTimeout(() => {
      if (!disableIntro && !introAlreadyShown) {
        this.setState({
          pageState: loaderPageStates.SHOW_INTRO
        });
      } else {
        this.setState({
          pageState: loaderPageStates.SHOW_PAGE
        });
        setTimeout(()=>this.setState({showBackground: false}), 400)
      }
    }, 500);
  };

  onIntroAnimationEnd = () => {
    this.setState({ pageState: loaderPageStates.INTRO_COMPLETED });

    setTimeout(() => {
      this.setState({
        pageState: loaderPageStates.SHOW_PAGE
      });
      setTimeout(()=>this.setState({showBackground: false}), 400)
    }, 500);
  };

  render() {
    const { children } = this.props;
    const { contentLoadedPercentage, pageState, showBackground } = this.state;

    return (
      <Div className={styles.loader_top_container}>
        {pageState == loaderPageStates.SHOW_PAGE && children}
        {
          showBackground && (
            <Div row align className={styles.background_loader_container}>
              <div className={styles.background_container}>
                <div className={styles.background}>
                  <BackgroundAnimator clientX={0} clientY={0} />
                </div>
              </div>
              <Transition
                items={pageState}
                from={{ opacity: 1 }}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0 }}
              >
                {pageState =>
                  pageState == loaderPageStates.IS_LOADING &&
                  (transitionProps => (
                    <Fragment>
                      <Spring
                        to={{
                          width: `calc(100vw - ${contentLoadedPercentage}vw)`,
                          x: contentLoadedPercentage
                        }}
                      >
                        {
                          springProps => (
                            <Fragment>
                              <div style={transitionProps} className={styles.percentage_text}>{Math.floor(springProps.x)}</div>
                              <div style={{
                                opacity: transitionProps.opacity,
                                width: springProps.width,
                              }} className={styles.loading_text_container}>
                                <div className={styles.loading_text}>
                                  Loading...
                                </div>
                              </div>
                            </Fragment>
                          )
                        }
                      </Spring>
                    </Fragment>
                  ))}
              </Transition>
            </Div>
          )
        }

        {/* Intro Animation */}
        {/* <Transition
          items={pageState}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {pageState =>
            pageState == loaderPageStates.SHOW_INTRO &&
            (props => (
              <Intro
                style={props}
                onAnimationEnd={() => this.onIntroAnimationEnd()}
              />
            ))
          }
        </Transition> */}
      </Div>
    );
  }
}

export default withRouter(Loader);
