import React, { Component, Fragment } from 'react';
import Intro from '../intro/intro';
import styles from './loader.scss';
import { Math } from 'core-js';
import profilePic from 'Images/profile-pic.jpeg';
import backgroundDarkDoodleFixed from 'Images/background-dark-doodle-first-layer.png';
import backgroundDarkDoodleFirst from 'Images/background-dark-doodle-fixed-layer.png';
import backgroundDarkDoodleSecond from 'Images/background-dark-doodle-second-layer.png';

import backgroundImageNykaa from 'Images/background-image-nykaa.jpg';
import backgroundImageTailoredTech from 'Images/background-image-tailoredtech.jpg';

import { loaderPageStates } from '../../constants/loaderConstants';
import PageReveal from '../../common/components/pageReveal';
import { Transition, Spring } from 'react-spring/renderprops';
import Div from 'Common/components/div';

export default class Loader extends Component {
  constructor(props) {
    super(props);

    document.addEventListener('DOMContentLoaded', this.getTotalLoadingItems, false);
    // window.addEventListener('load', this.completeLoading);

    this.state = {
      contentLoadedPercentage: 0,
      totalItems: 0,
      itemsLoaded: 0,
      pageState: loaderPageStates.IS_LOADING,
      disableIntro: true,
    }
    this.previousContentLoadedPercentage = 0;

    const interval = setInterval(() => {
      const { itemsLoaded, totalItems } = this.state;

      if (itemsLoaded != totalItems) {
        this.documentLoaded();
        if (itemsLoaded == totalItems) {
          this.completeLoading();
          clearInterval(interval);
        }
      } else {
        this.completeLoading();
        clearInterval(interval);
      }
    }, 500);
  }

  preloadImage = (src) => {
    const image = new Image();
    image.src = src;

    return image;
  }

  getTotalLoadingItems = () => {
    // const scriptTags = Array.from(document.scripts);
    // const styleTags = Array.from(document.styleSheets);
    const images = Array.from(document.images);
    images.push(this.preloadImage(profilePic));
    images.push(this.preloadImage(backgroundDarkDoodleFixed));
    images.push(this.preloadImage(backgroundDarkDoodleFirst));
    images.push(this.preloadImage(backgroundDarkDoodleSecond));
    images.push(this.preloadImage(backgroundImageNykaa));
    images.push(this.preloadImage(backgroundImageTailoredTech));

    // TODO remove Fake loading
    this.setState({ totalItems: images.length + 3 });

    /*     if(scriptTags)
          scriptTags.forEach(element => {      
            element.onload = this.documentLoaded;
            element.onerror = this.documentLoaded;
          }); */

    if (images)
      images.forEach(element => {
        element.onload = this.documentLoaded;
        element.onerror = this.documentLoaded;
      });

    /*  if(styleTags)
          styleTags.forEach(element => {
            debugger;
            element.onload = this.documentLoaded;
            element.onerror = this.documentLoaded; 
          }); */
  }

  documentLoaded = () => {
    const {
      totalItems,
      itemsLoaded,
      contentLoadedPercentage,
    } = this.state;

    this.previousContentLoadedPercentage = contentLoadedPercentage;
    this.setState({
      contentLoadedPercentage: Math.trunc(((itemsLoaded + 1) / totalItems) * 100),
      itemsLoaded: itemsLoaded + 1,
    });

    // if (itemsLoaded+1 == totalItems) {
    //   this.completeLoading();
    // }
  }

  completeLoading = () => {
    const { contentLoadedPercentage, disableIntro } = this.state;

    if (contentLoadedPercentage != 100)
      this.setState({ contentLoadedPercentage: 100 });

    this.setState({
      pageState: loaderPageStates.COMPLETED_LOADING,
    });

    setTimeout(() => {
      if (!disableIntro) {
        this.setState({
          pageState: loaderPageStates.SHOW_INTRO
        });
      } else {
        this.setState({
          pageState: loaderPageStates.SHOW_PAGE
        });
      }
    }, 500);
  }

  onIntroAnimationEnd = () => {
    this.setState({
      pageState: loaderPageStates.SHOW_PAGE
    });
  }

  render() {
    const { children } = this.props;
    const {
      contentLoadedPercentage,
      pageState,
    } = this.state;

    return (
      <Div className={styles.loader_top_container}>
        {pageState == loaderPageStates.SHOW_PAGE && children}
        {/* LOADER */}
        <Transition
          items={pageState}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {pageState => pageState == loaderPageStates.IS_LOADING && (
            props => (
              <Div row fillParent style={props} className={styles.loader_container}>
                <div className={styles.loading_text}>Loading ...</div>

                <Spring
                  from={{ width: `${this.previousContentLoadedPercentage}vw`, x: this.previousContentLoadedPercentage }}
                  to={{ width: `${contentLoadedPercentage}vw`, x: contentLoadedPercentage }}
                >
                  {props => (
                    <Div animate row className={styles.loader_width_percentage} style={props}>
                      <div className={styles.percentage_text}>{Math.floor(props.x)}</div>
                    </Div>
                  )}
                </Spring>
              </Div>

            )
          )}
        </Transition>


        {/* Intro Animation */}
        <Transition
          items={pageState}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {pageState => pageState == loaderPageStates.SHOW_INTRO && (props =>
            <Intro style={props} onAnimationEnd={() => this.onIntroAnimationEnd()} />
          )}
        </Transition>

      </Div>
    );
  }
}
