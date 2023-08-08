import React from "react";
import styles from "./Tokens.scss";
import styleUtils from "../styles/style-utils.scss";
import { Row } from "../layout/Row";
import { ReactComponent as HubsDuckIcon } from "../icons/footer-duck.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";

export const NoAccess = () => {
  return (
    <Column padding="xl" className={styles.noAccessContainer} lastChildMargin={false}>
      <Row noWrap>
        <div className={styles.noAccessIcon}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </div>
        <h2>
          <FormattedMessage
            id="tokens.administrator-privileges-required"
            defaultMessage="Требуются привилегии администратора"
          />
        </h2>
      </Row>
      <div className={styleUtils.mdMarginY}>
        <p className={styleUtils.margin0}>
          <FormattedMessage
            id="tokens.no-access-description1"
            defaultMessage="Вы не обладаете достаточными правами для создания API-токенов."
          />
        </p>
        <p>
          <FormattedMessage
            id="tokens.no-access-description2"
            defaultMessage="Если вы считаете, что должны иметь доступ к этой странице, запросите права у администратора Hubs."
          />
        </p>
      </div>
      <div className={styles.noAccessFooterDuckContainer}>
        <HubsDuckIcon className={styles.noAccessFooterDuck} />
      </div>
    </Column>
  );
};
