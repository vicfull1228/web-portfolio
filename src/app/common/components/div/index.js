import React, { Component } from "react";
import styles from "./div.module.scss";
import { animated } from "react-spring";

class Div extends Component {
  render() {
    const {
      row,
      align,
      justify,
      fillParent,
      className,
      children,
      animate,
      flex,
      style,
      ...rest
    } = this.props;

    const classNameArray = [
      row ? styles.div_row : styles.div_column,
      align
        ? typeof align == "string"
          ? styles[`align_${align}`]
          : styles.align_center
        : "",
      justify
        ? typeof justify == "string"
          ? styles[`justify_${justify}`]
          : styles.justify_center
        : "",
      fillParent ? styles.fill_parent : "",
      className
    ];

    let styleValue = style ? style : {};

    if (flex) {
      styleValue = { ...styleValue, flex: typeof flex == "number" ? flex : 1 };
    }

    if (animate) {
      return (
        <animated.div
          className={classNameArray.join(" ")}
          style={styleValue}
          {...rest}
        >
          {children}
        </animated.div>
      );
    }

    return (
      <div className={classNameArray.join(" ")} style={styleValue} {...rest}>
        {children}
      </div>
    );
  }
}

export default Div;
