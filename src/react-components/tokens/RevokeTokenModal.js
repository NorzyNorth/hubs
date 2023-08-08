import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Modal } from "../../react-components/modal/Modal";
import styles from "./Tokens.scss";
import styleUtils from "../styles/style-utils.scss";
import { Button } from "../input/Button";
import { Row } from "../layout/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { Column } from "../layout/Column";
import { SpinWhileTrue } from "../layout/SpinWhileTrue";

export function RevokeTokenModal({ onClose, onRevoke, error, isPending }) {
  return (
    <Modal
      title={<FormattedMessage id="revoke-token-modal.title" defaultMessage="Отозвать токен" />}
      beforeTitle={<FontAwesomeIcon icon={faExclamationTriangle} />}
      afterTitle={
        <div className={styles.closeModalButton}>
          <FontAwesomeIcon onClick={onClose} icon={faTimes} />
        </div>
      }
      disableFullscreen
      className={styles.maxWidth400}
    >
      <SpinWhileTrue isSpinning={isPending}>
        {error && (
          <Row padding="sm" className={styles.revokeWarning}>
            <p>{`An Error occured: ${error}`}</p>
          </Row>
        )}
        <Column padding="sm">
          <Column className={styles.revokeDescription}>
            <p className={styleUtils.xsMarginBottom}>
              <FormattedMessage
                id="revoke-token-modal.description1"
                defaultMessage="Вы уверены, что хотите отозвать этот токен?"
              />
            </p>
            <p>
              <FormattedMessage
                id="revoke-token-modal.description2"
                defaultMessage="Любые скрипты или запросы, полагающиеся на этот токен, потеряют доступ."
              />
            </p>
          </Column>
          <Row padding="sm" className={styles.revokeWarning}>
            <p>
              <FormattedMessage id="revoke-token-modal.revoke-warning-1" defaultMessage="Это действие" />{" "}
              <b>
                <FormattedMessage id="revoke-token-modal.revoke-warning-2" defaultMessage="постоянное" />
              </b>{" "}
              <FormattedMessage id="revoke-token-modal.revoke-warning-3" defaultMessage="и" />{" "}
              <b>
                <FormattedMessage id="revoke-token-modal.revoke-warning-4" defaultMessage="не может быть отменено." />
              </b>
            </p>
          </Row>
          <Row spaceBetween padding="sm">
            <Button preset="basic" sm onClick={onClose}>
              <FormattedMessage id="revoke-token-modal.cancel" defaultMessage="Отмена" />
            </Button>
            <Button preset="accent1" sm onClick={onRevoke}>
              <FormattedMessage id="revoke-token-modal.revoke" defaultMessage="Отозвать" />
            </Button>
          </Row>
        </Column>
      </SpinWhileTrue>
    </Modal>
  );
}

RevokeTokenModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  error: PropTypes.string,
  isPending: PropTypes.bool
};
