import React, { Component, memo } from "react";
import { Transition, config } from "react-spring/renderprops";
import Div from 'Common/components/div';
import styles from './header_description.module.scss';
import ContactComponent from "Common/components/contactComponent";

class HeaderDescription extends Component {
  render() {
    const { showDescription, onClickProject, onClickTimeline, isFirstTime } = this.props;

    return (
      <Transition
        items={showDescription}
        from={{
          opacity: 0,
          transform: 'translate(calc(50vw - 265px), calc(50vh - 0px))'
        }}
        enter={{
          opacity: 1,
          transform: 'translate(calc(50vw - 265px), calc(50vh - 145px))'
        }}
        leave={{
          opacity: 0
        }}
        config={isFirstTime ? { delay: 300 } : config.default}
      >
        {showDescription =>
          showDescription &&
          (props => (
            <Div
              style={props}
              className={styles.user_description_container}
            >
              <div className={styles.user_description}>
                Hi, <br />I am <b className={styles.name}>Riyaz Ahmed</b>, A Self-taught Developer with 4+ years of Software Development experience on various Platforms, Passionate to build Polished, Innovative and well-detailed Apps with Fluid Animations to complement the Design.
                {/* <br/><br/> In my spare time, I usually read or play video games but mostly i try to work on new ideas and learn. */}
              </div>

              <Div row justify align className={styles.user_button_container}>
                Checkout my
                <Div align className={styles.user_button} onClick={onClickTimeline}>
                  Timeline
                  <div className={styles.underline}></div>
                </Div>
                and
                <Div align className={styles.user_button} onClick={onClickProject}>
                  Technologies
                  <div className={styles.underline}></div>
                </Div>
                that I worked on.
              </Div>

              <ContactComponent
                className={styles.contact_container}
              />
            </Div>
          ))
        }
      </Transition>
    );
  }
}

export default memo(HeaderDescription);
