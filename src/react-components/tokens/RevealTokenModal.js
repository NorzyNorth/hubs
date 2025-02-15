import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Modal } from "../../react-components/modal/Modal";
import styles from "./Tokens.scss";
import styleUtils from "../styles/style-utils.scss";
import { Button } from "../input/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { Column } from "../layout/Column";
import { Row } from "../layout/Row";
import { Center } from "../layout/Center";
import classNames from "classnames";
import { CopyableTextInputField } from "../input/CopyableTextInputField";

export const RevealTokenModal = ({ token, selectedScopes, onClose }) => {
  return (
    <Modal
      titleNode={
        <h2>
          <FormattedMessage id="save-api-token.title" defaultMessage="API-токен" />
        </h2>
      }
      afterTitle={<CloseModalButton onClose={onClose} />}
      disableFullscreen
      className={classNames(styles.maxWidth400, styles.tokenModal)}
    >
      <Column gap="xl" className={styleUtils.xlMarginTop}>
        <p>
          <b>
            <FormattedMessage
              id="save-api-token.description1"
              defaultMessage="Пожалуйста, сохраните этот API-токен в надежном месте."
            />
          </b>
          <br />
          <FormattedMessage
            id="save-api-token.description2"
            defaultMessage="После закрытия этого окна вы больше не сможете его увидеть."
          />
        </p>
        <CopyableTextInputField
          buttonPreset="accent6"
          className={styles.maxWidthAuto}
          inputClassName={classNames(styles.backgroundDarkGrey, styles.textWhite)}
          label={<FormattedMessage id="save-api-token.copy-label" defaultMessage="API-токен" />}
          value={token}
          description={
            <p>
              <FormattedMessage id="save-api-token.copied" defaultMessage="Скопировано" />
            </p>
          }
        />
        <Row padding="sm" className={styles.backgroundLightGrey}>
          <p>
            <b>
              <FormattedMessage id="save-api-token.scopes" defaultMessage="Прицелы" />:
            </b>{" "}
            {selectedScopes &&
              selectedScopes.map((scopeName, idx) => `${scopeName}${selectedScopes.length - 1 > idx ? ", " : ""}`)}
          </p>
        </Row>
        <Center>
          <Button preset="primary" sm onClick={onClose}>
            <FormattedMessage id="save-api-token.revoke" defaultMessage="Подтвердить и закрыть" />
          </Button>
        </Center>
      </Column>
    </Modal>
  );
};

RevealTokenModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  selectedScopes: PropTypes.array.isRequired
};

const CloseModalButton = ({ onClose }) => {
  return (
    <div className={styles.closeModalButton}>
      <FontAwesomeIcon icon={faTimes} onClick={onClose} />
    </div>
  );
};

CloseModalButton.propTypes = {
  onClose: PropTypes.func.isRequired
};
