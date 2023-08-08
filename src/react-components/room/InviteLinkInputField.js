import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./RoomSettingsSidebar.scss";
import { IconButton } from "../input/IconButton";
import { FormattedMessage, useIntl } from "react-intl";
import { CopyableTextInputField } from "../input/CopyableTextInputField";

export function InviteLinkInputField({ fetchingInvite, inviteUrl, onRevokeInvite }) {
  const intl = useIntl();

  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);

  const revokeInvite = useCallback(() => {
    setShowRevokeConfirmation(true);
  }, []);

  const cancelConfirmRevokeInvite = useCallback(() => {
    setShowRevokeConfirmation(false);
  }, []);

  const confirmRevokeInvite = useCallback(() => {
    onRevokeInvite();
    setShowRevokeConfirmation(false);
  }, [onRevokeInvite]);

  return (
    <CopyableTextInputField
      label={<FormattedMessage id="invite-link-input-field.label" defaultMessage="Ссылка для приглашения" />}
      disabled={fetchingInvite}
      value={
        fetchingInvite
          ? intl.formatMessage({
              id: "invite-link-input-field.generating-invite",
              defaultMessage: "Генерация приглашений..."
            })
          : inviteUrl
      }
      buttonPreset="primary"
      description={
        !fetchingInvite &&
        (showRevokeConfirmation ? (
          <>
            <FormattedMessage id="invite-link-input-field.revoke-confirm" defaultMessage="Вы уверены?" />{" "}
            <IconButton className={styles.confirmRevokeButton} onClick={confirmRevokeInvite}>
              <FormattedMessage id="invite-link-input-field.revoke-confirm-yes" defaultMessage="да" />
            </IconButton>{" "}
            /{" "}
            <IconButton className={styles.confirmRevokeButton} onClick={cancelConfirmRevokeInvite}>
              <FormattedMessage id="invite-link-input-field.revoke-confirm-no" defaultMessage="нет" />
            </IconButton>
          </>
        ) : (
          <IconButton className={styles.confirmRevokeButton} onClick={revokeInvite}>
            <FormattedMessage id="invite-link-input-field.revoke" defaultMessage="отменить" />
          </IconButton>
        ))
      }
      fullWidth
    />
  );
}

InviteLinkInputField.propTypes = {
  fetchingInvite: PropTypes.bool,
  inviteUrl: PropTypes.string,
  onRevokeInvite: PropTypes.func.isRequired
};
