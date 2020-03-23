import React from 'react';
import styles from './mobile_overlay.module.scss';
import Div from 'Common/components/div';
import ContactComponent from 'Common/components/contactComponent';

const MobileOverlay = () => {
  return (
    <Div className={styles.mobile_overlay_top_container}>
      <Div fillParent className={styles.content_container}>
        <div className={styles.message_container}>
          <div>The mobile responsive is still under development 🙈, Open this site on Desktop to get the full experience.</div>
          <ContactComponent isWhite className={styles.contact_component}/>
        </div>
      </Div>
    </Div>
  );
}


export default MobileOverlay;
