import React, { Component, Fragment } from "react";
import styles from "./header.module.scss";
import profilePic from "Images/profile-pic.jpeg";
import { landingPageBody } from "../../constants/landingConstants";
import Div from "Common/components/div";
import { Spring, Transition, config } from "react-spring/renderprops";
import HeaderDescription from './headerDescription';
import HeaderBackground from './headerBackground';

class Header extends Component {
  state = {
    isFullScreen: true,
    showDescription: true,
    clientX: 0,
    clientY: 0,
    isFirstTime: true,
  };

  componentDidMount() {
    const { isFirstTime } = this.state;

    if (isFirstTime) {
      setTimeout(() => {
        this.setState({ isFirstTime: false });
      }, 1000);
    }
  }

  showFullScreen = () => {
    // from header to full screen
    this.setState({
      isFullScreen: true
    });

    setTimeout(() => {
      this.setState({
        showDescription: true
      });
    }, 800);
  };

  hideFullScreen = () => {
    this.setState({ showDescription: false });

    setTimeout(() => {
      this.setState({
        isFullScreen: false
      });
    }, 500);
  };

  onClickProfilePic = () => {
    const { isFullScreen } = this.state;

    if (!isFullScreen)
      this.showFullScreen();
  };

  onClickProject = () => {
    const { isFullScreen } = this.state;
    const { updateBodyType } = this.props;

    if (isFullScreen) {
      setTimeout(() => {
        updateBodyType(landingPageBody.PROJECT);
      }, 600);
    } else updateBodyType(landingPageBody.PROJECT);

    if (isFullScreen) this.hideFullScreen();
  };

  onClickTimeline = () => {
    const { isFullScreen } = this.state;
    const { updateBodyType } = this.props;

    if (isFullScreen) {
      setTimeout(() => {
        updateBodyType(landingPageBody.TIMELINE);
      }, 600);
    } else updateBodyType(landingPageBody.TIMELINE);

    if (isFullScreen) this.hideFullScreen();
  };

  render() {
    const { isFullScreen, showDescription, clientX, clientY, isFirstTime } = this.state;
    const { bodyType } = this.props;

    return (
      <Spring
        to={{
          backgroundColor: isFullScreen ? '#333333ff' : '#33333300',
          height: isFullScreen ? 'calc(100vh + 0px)' : 'calc(0vh + 70px)', //Because have to keep a same format even the operator and type of units
        }}
      >
        {
          props => (
            <div
              style={{
                backgroundColor: props.backgroundColor,
                height: props.height,
              }}
              className={`${
                isFullScreen ? styles.header_fullscreen : styles.header_normal
                } ${styles.header_container}`}
              onMouseMove={showDescription ? ({ clientX: x, clientY: y }) => this.setState({ clientX: x, clientY: y }): null}
            >

              <HeaderBackground
                clientX={clientX}
                clientY={clientY}
                showBackground={showDescription}
                isFirstTime={isFirstTime}
              />


              <Div className={`${styles.header_link_container}`}>
                <Div row className={styles.bodytype_container}>
                  <div
                    className={styles.header_link_button}
                    onClick={this.onClickTimeline}
                  >
                    Timeline
                  </div>
                  <div
                    className={styles.header_link_button}
                    onClick={this.onClickProject}
                  >
                    Tech
                  </div>
                </Div>
                <Spring
                  to={{
                    marginLeft: bodyType == landingPageBody.TIMELINE ? 6 : 82,
                    width: bodyType == landingPageBody.TIMELINE ? 62 : 37,
                  }}
                >
                  {props => <div style={props} className={styles.underline}></div>}
                </Spring>
              </Div>

              <Div align className={styles.content_container}
              >

                <Transition
                  items={true}
                  key={1}
                  from={{ opacity: 0, marginTop: "100px" }}
                  enter={{ opacity: 1, marginTop: "0px" }}
                  leave={{ opacity: 0 }}
                  config={{ delay: 600 }}
                >
                  {value => value && (props => (
                    <img
                      style={props}
                      src={profilePic}
                      className={styles.user_pic}
                      onClick={this.onClickProfilePic}
                    />
                  ))}
                </Transition>

                <HeaderDescription
                  showDescription={showDescription}
                  onClickProject={this.onClickProject}
                  onClickTimeline={this.onClickTimeline}
                  isFirstTime={isFirstTime}
                />
              </Div>
            </div>
          )
        }
      </Spring>
    );
  }
}

export default Header;
