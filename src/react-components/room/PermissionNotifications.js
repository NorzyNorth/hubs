import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./PermissionNotifications.scss";
import { useIntl, defineMessages } from "react-intl";
import { ReactComponent as MicrophoneMutedIcon } from "../icons/MicrophoneMuted.svg";
import { ReactComponent as Microphone } from "../icons/Microphone.svg";
import { ReactComponent as Chat } from "../icons/Chat.svg";
import { ReactComponent as ChatOff } from "../icons/ChatOff.svg";

export const permissionsIcons = {
  voiceChatEnabled: <Microphone />,
  voiceChatDisabled: <MicrophoneMutedIcon />,
  voiceChatDisabledMod: <MicrophoneMutedIcon />,
  textChatEnabled: <Chat />,
  textChatDisabled: <ChatOff />,
  textChatDisabledMod: <ChatOff />
};

export const permissionsMessages = defineMessages({
  voiceChatEnabled: {
    id: "chat-sidebar.moderator-message.voice-chat-enabled",
    defaultMessage: "Голосовой чат был включен модератором"
  },
  voiceChatDisabled: {
    id: "chat-sidebar.moderator-message.voice-chat-disabled",
    defaultMessage: "Голосовой чат был отключен модератором"
  },
  voiceChatDisabledMod: {
    id: "chat-sidebar.moderator-message.voice-chat-disabled-mod",
    defaultMessage: "Гости не могут использовать голосовой чат"
  },
  textChatEnabled: {
    id: "chat-sidebar.moderator-message.text-chat-enabled",
    defaultMessage: "Текстовый чат был включен модератором"
  },
  textChatDisabled: {
    id: "chat-sidebar.moderator-message.text-chat-disabled",
    defaultMessage: "Текстовый чат был отключен модератором"
  },
  textChatDisabledMod: {
    id: "chat-sidebar.moderator-message.text-chat-disabled-mod",
    defaultMessage: "Гости не могут отправлять сообщения в чат"
  }
});

function camelize(text) {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text.substring(0, 1).toLowerCase() + text.substring(1);
}

export function permissionMessage({ permission, status, isMod = false }, intl) {
  const key = `${permission}_${status ? "enabled" : "disabled"}${isMod ? "_Mod" : ""}`;
  const message = intl.formatMessage(permissionsMessages[camelize(key)]);
  const icon = permissionsIcons[camelize(key)];
  return (
    <>
      {icon}
      <p>{message}</p>
    </>
  );
}

export function PermissionNotification({ permission, className, isMod }) {
  const intl = useIntl();
  return (
    <div key={permission} className={classNames(styles.pinnedMessage, className)}>
      {permissionMessage(
        {
          permission: permission,
          status: false,
          isMod
        },
        intl
      )}
    </div>
  );
}

PermissionNotification.propTypes = {
  permission: PropTypes.string,
  className: PropTypes.string,
  isMod: PropTypes.bool
};

PermissionNotification.defaultProps = {
  isMod: false
};
