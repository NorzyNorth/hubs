import React, { useEffect, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { ReactComponent as WandIcon } from "../icons/Wand.svg";
import { ReactComponent as AttachIcon } from "../icons/Attach.svg";
import { ReactComponent as SendIcon } from "../icons/Send.svg";
import { ReactComponent as ReactionIcon } from "../icons/Reaction.svg";
import { IconButton } from "../input/IconButton";
import { TextAreaInput } from "../input/TextAreaInput";
import { Popover } from "../popover/Popover";
import { EmojiPicker } from "./EmojiPicker";
import styles from "./ChatSidebar.scss";
import { formatMessageBody } from "../../utils/chat-message";
import { FormattedMessage, useIntl, defineMessages, FormattedRelativeTime } from "react-intl";
import { permissionMessage } from "./PermissionNotifications";

export function SpawnMessageButton(props) {
  return (
    <IconButton className={styles.chatInputIcon} {...props}>
      <WandIcon />
    </IconButton>
  );
}

export function SendMessageButton(props) {
  return (
    <IconButton className={styles.chatInputIcon} {...props}>
      <SendIcon />
    </IconButton>
  );
}

// Memoize EmojiPickerPopoverButton since we don't want it re-rendering
// the EmojiPicker unnecessarily.
export const EmojiPickerPopoverButton = React.memo(({ onSelectEmoji, disabled }) => {
  // We're using a ref here, since we don't want to re-render anything, but we
  // do want to know if the Shift key is down when an emoji is selected.
  const shiftKeyDown = useRef(false);

  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === "Shift") shiftKeyDown.current = true;
    };
    const onKeyUp = e => {
      if (e.key === "Shift") shiftKeyDown.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <Popover
      title=""
      popoverClass={styles.emojiPopover}
      showHeader={false}
      content={({ closePopover }) => (
        <EmojiPicker
          onEmojiClick={emoji => {
            const keepPickerOpen = shiftKeyDown.current;
            onSelectEmoji({ emoji: emoji.emoji, pickerRemainedOpen: keepPickerOpen });
            // Keep the picker open if the Shift key was held down to allow
            // for multiple emoji selections.
            if (!keepPickerOpen) closePopover();
          }}
        />
      )}
      placement="top"
      offsetDistance={28}
    >
      {({ togglePopover, popoverVisible, triggerRef }) => (
        <IconButton
          ref={triggerRef}
          className={styles.chatInputIcon}
          selected={popoverVisible}
          onClick={togglePopover}
          disabled={disabled}
        >
          <ReactionIcon />
        </IconButton>
      )}
    </Popover>
  );
});

EmojiPickerPopoverButton.propTypes = {
  onSelectEmoji: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

EmojiPickerPopoverButton.displayName = "EmojiPickerPopoverButton";

export function MessageAttachmentButton(props) {
  return (
    <>
      <IconButton as="label" className={styles.chatInputIcon} disabled={props.disabled}>
        <AttachIcon />
        <input type="file" {...props} disabled={props.disabled} />
      </IconButton>
    </>
  );
}

MessageAttachmentButton.propTypes = {
  disabled: PropTypes.bool
};

export function ChatLengthWarning({ messageLength, maxLength }) {
  return (
    <p
      className={classNames(styles.chatInputWarning, {
        [styles.warningTextColor]: messageLength > maxLength
      })}
    >
      <FormattedMessage
        id="chat-message-input.warning-max-characters"
        defaultMessage="Максимальное количество символов"
      />
      {` (${messageLength}/${maxLength})`}
    </p>
  );
}

ChatLengthWarning.propTypes = {
  messageLength: PropTypes.number,
  maxLength: PropTypes.number
};

export const ChatInput = forwardRef(({ warning, isOverMaxLength, ...props }, ref) => {
  const intl = useIntl();

  return (
    <div className={styles.chatInputContainer}>
      <TextAreaInput
        ref={ref}
        textInputStyles={styles.chatInputTextAreaStyles}
        className={classNames({ [styles.warningBorder]: isOverMaxLength })}
        placeholder={intl.formatMessage({ id: "chat-sidebar.input.placeholder", defaultMessage: "Сообщение..." })}
        {...props}
      />
      {warning}
    </div>
  );
});

ChatInput.propTypes = {
  onSpawn: PropTypes.func,
  warning: PropTypes.node,
  isOverMaxLength: PropTypes.bool
};

ChatInput.displayName = "ChatInput";

const enteredMessages = defineMessages({
  room: { id: "chat-sidebar.system-message.entered-room", defaultMessage: "{name} вошел в комнату." },
  lobby: { id: "chat-sidebar.system-message.entered-lobby", defaultMessage: "{name} вошел в холл." }
});

const joinedMessages = defineMessages({
  lobby: { id: "chat-sidebar.system-message.joined-lobby", defaultMessage: "{name} присоединился к лобби." },
  room: { id: "chat-sidebar.system-message.joined-room", defaultMessage: "{name} вошел в комнату." }
});

export const LogMessageType = {
  roomEntryRequired: "roomEntryRequired",
  flyModeDisabled: "flyModeDisabled",
  flyModeEnabled: "flyModeEnabled",
  unauthorizedSceneChange: "unauthorizedSceneChange",
  invalidSceneUrl: "invalidSceneUrl",
  unauthorizedRoomRename: "unauthorizedRoomRename",
  captureUnavailable: "captureUnavailable",
  captureStopped: "captureStopped",
  captureStarted: "captureStarted",
  captureAlreadyStopped: "captureAlreadyStopped",
  captureAlreadyRunning: "captureAlreadyRunning",
  positionalAudioEnabled: "positionalAudioEnabled",
  positionalAudioDisabled: "positionalAudioDisabled",
  setAudioNormalizationFactor: "setAudioNormalizationFactor",
  audioNormalizationDisabled: "audioNormalizationDisabled",
  audioNormalizationNaN: "audioNormalizationNaN",
  invalidAudioNormalizationRange: "invalidAudioNormalizationRange",
  audioSuspended: "audioSuspended",
  audioResumed: "audioResumed",
  joinFailed: "joinFailed",
  avatarChanged: "avatarChanged"
};

const logMessages = defineMessages({
  [LogMessageType.roomEntryRequired]: {
    id: "chat-sidebar.log-message.room-entry-required",
    defaultMessage: "Для использования этой команды необходимо войти в помещение."
  },
  [LogMessageType.flyModeDisabled]: {
    id: "chat-sidebar.log-message.fly-mode-disabled",
    defaultMessage: "Режим полета отключен."
  },
  [LogMessageType.flyModeEnabled]: {
    id: "chat-sidebar.log-message.fly-mode-enabled",
    defaultMessage: "Включен режим полета."
  },
  [LogMessageType.unauthorizedSceneChange]: {
    id: "chat-sidebar.log-message.unauthorized-scene-change",
    defaultMessage: "У вас нет разрешения на изменение обстановки."
  },
  [LogMessageType.invalidSceneUrl]: {
    id: "chat-sidebar.log-message.invalid-scene-url",
    defaultMessage: "Этот URL-адрес не указывает на сцену или действительный GLB."
  },
  [LogMessageType.unauthorizedRoomRename]: {
    id: "chat-sidebar.log-message.unauthorized-room-rename",
    defaultMessage: "У вас нет разрешения на переименование этой комнаты."
  },
  [LogMessageType.captureUnavailable]: {
    id: "chat-sidebar.log-message.capture-unavailable",
    defaultMessage: "Захват недоступен."
  },
  [LogMessageType.captureStopped]: {
    id: "chat-sidebar.log-message.capture-stopped",
    defaultMessage: "Захват прекращен."
  },
  [LogMessageType.captureStarted]: {
    id: "chat-sidebar.log-message.capture-started",
    defaultMessage: "Захват начат."
  },
  [LogMessageType.captureAlreadyStopped]: {
    id: "chat-sidebar.log-message.capture-already-stopped",
    defaultMessage: "Захват уже остановлен."
  },
  [LogMessageType.captureAlreadyRunning]: {
    id: "chat-sidebar.log-message.capture-already-running",
    defaultMessage: "Захват уже выполняется."
  },
  [LogMessageType.positionalAudioEnabled]: {
    id: "chat-sidebar.log-message.positional-audio-enabled",
    defaultMessage: "Включен позиционный звук."
  },
  [LogMessageType.positionalAudioDisabled]: {
    id: "chat-sidebar.log-message.positional-audio-disabled",
    defaultMessage: "Отключение позиционного звука."
  },
  [LogMessageType.setAudioNormalizationFactor]: {
    id: "chat-sidebar.log-message.set-audio-normalization-factor",
    defaultMessage: "Коэффициент нормализации звука установлен в значение {factor}."
  },
  [LogMessageType.audioNormalizationDisabled]: {
    id: "chat-sidebar.log-message.audio-normalization-disabled",
    defaultMessage: "audioNormalization отключен."
  },
  [LogMessageType.audioNormalizationNaN]: {
    id: "chat-sidebar.log-message.audio-normalization-nan",
    defaultMessage: "Для команды audioNormalization необходим корректный параметр number."
  },
  [LogMessageType.invalidAudioNormalizationRange]: {
    id: "chat-sidebar.log-message.invalid-audio-normalization-range",
    defaultMessage:
      "Команда audioNormalization требует указания номера базовой громкости в диапазоне от 0 [без нормализации] до 255. По умолчанию - 0. Рекомендуемое значение - 4, если вы хотите включить нормализацию."
  },
  [LogMessageType.audioSuspended]: {
    id: "chat-sidebar.log-message.audio-suspended",
    defaultMessage: "Звук был приостановлен, для возобновления звука щелкните в любом месте комнаты."
  },
  [LogMessageType.audioResumed]: {
    id: "chat-sidebar.log-message.audio-resumed",
    defaultMessage: "Звуковое сопровождение было возобновлено."
  },
  [LogMessageType.joinFailed]: {
    id: "chat-sidebar.log-message.join-failed",
    defaultMessage: "Не удалось присоединиться к комнате: {message}"
  },
  [LogMessageType.avatarChanged]: {
    id: "chat-sidebar.log-message.avatar-changed",
    defaultMessage: "Ваш аватар был изменен."
  }
});

// TODO: use react-intl's defineMessages to get proper extraction
export function formatSystemMessage(entry, intl) {
  switch (entry.type) {
    case "join":
      return intl.formatMessage(joinedMessages[entry.presence], { name: <b>{entry.name}</b> });
    case "entered":
      return intl.formatMessage(enteredMessages[entry.presence], { name: <b>{entry.name}</b> });
    case "leave":
      return (
        <FormattedMessage
          id="chat-sidebar.system-message.leave"
          defaultMessage="{name} вышел."
          values={{ name: <b>{entry.name}</b> }}
        />
      );
    case "display_name_changed":
      return (
        <FormattedMessage
          id="chat-sidebar.system-message.name-change"
          defaultMessage="{oldName} теперь известен как {newName}"
          values={{ oldName: <b>{entry.oldName}</b>, newName: <b>{entry.newName}</b> }}
        />
      );
    case "scene_changed":
      return (
        <FormattedMessage
          id="chat-sidebar.system-message.scene-change"
          defaultMessage="{name} изменил место действия на {sceneName}"
          values={{ name: <b>{entry.name}</b>, sceneName: <b>{entry.sceneName}</b> }}
        />
      );
    case "hub_name_changed":
      return (
        <FormattedMessage
          id="chat-sidebar.system-message.hub-name-change"
          defaultMessage="{name} изменил название комнаты на {hubName}"
          values={{ name: <b>{entry.name}</b>, hubName: <b>{entry.hubName}</b> }}
        />
      );
    case "hub_changed":
      return (
        <FormattedMessage
          id="chat-sidebar.system-message.hub-change"
          defaultMessage="Вы находитесь в {hubName}"
          values={{ hubName: <b>{entry.hubName}</b> }}
        />
      );
    case "log":
      return intl.formatMessage(logMessages[entry.messageType], entry.props);
    default:
      return null;
  }
}

export function SystemMessage(props) {
  const intl = useIntl();

  return (
    <li className={classNames(styles.messageGroup, styles.systemMessage)}>
      {props.showLineBreak && <hr />}
      <p className={styles.messageGroupLabel}>
        <i>{formatSystemMessage(props, intl)}</i>
        <span>
          <FormattedRelativeTime updateIntervalInSeconds={10} value={(props.timestamp - Date.now()) / 1000} />
        </span>
      </p>
    </li>
  );
}

SystemMessage.propTypes = {
  timestamp: PropTypes.any,
  showLineBreak: PropTypes.bool
};

export const bubbletypes = ["none", "left", "middle", "right"];

function MessageBubble({ media, monospace, emoji, children, permission }) {
  return (
    <div
      className={classNames(styles.messageBubble, {
        [styles.media]: media,
        [styles.emoji]: emoji,
        [styles.monospace]: monospace,
        [styles.permission]: permission
      })}
    >
      {children}
    </div>
  );
}

MessageBubble.propTypes = {
  media: PropTypes.bool,
  monospace: PropTypes.bool,
  emoji: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  children: PropTypes.node,
  permission: PropTypes.bool
};

function getMessageComponent(message) {
  switch (message.type) {
    case "chat": {
      const { formattedBody, monospace, emoji } = formatMessageBody(message.body);
      return (
        <MessageBubble key={message.id} monospace={monospace} emoji={emoji}>
          {formattedBody}
        </MessageBubble>
      );
    }
    case "video":
      return (
        <MessageBubble key={message.id} media>
          <video controls src={message.body.src} />
        </MessageBubble>
      );
    case "image":
    case "photo":
      return (
        <MessageBubble key={message.id} media>
          <img src={message.body.src} />
        </MessageBubble>
      );
    case "permission":
      return (
        <MessageBubble key={message.id} media>
          <img src={message.body.src} />
        </MessageBubble>
      );
    default:
      return null;
  }
}

export function ChatMessageGroup({ sent, sender, timestamp, messages }) {
  const intl = useIntl();
  return (
    <li className={classNames(styles.messageGroup, { [styles.sent]: sent })}>
      <p className={styles.messageGroupLabel}>
        {sender} | <FormattedRelativeTime updateIntervalInSeconds={10} value={(timestamp - Date.now()) / 1000} />
      </p>
      <ul className={styles.messageGroupMessages}>{messages.map(message => getMessageComponent(message, intl))}</ul>
    </li>
  );
}

ChatMessageGroup.propTypes = {
  sent: PropTypes.bool,
  sender: PropTypes.string,
  timestamp: PropTypes.any,
  messages: PropTypes.array
};

export function PermissionMessageGroup({ sent, timestamp, messages }) {
  const intl = useIntl();
  return (
    <li className={classNames(styles.messageGroup, { [styles.sent]: sent })}>
      <p className={styles.messageGroupLabel}>
        <FormattedRelativeTime updateIntervalInSeconds={10} value={(timestamp - Date.now()) / 1000} />
      </p>
      <ul className={styles.messageGroupMessages}>
        {messages.map(message => (
          <MessageBubble key={message.id} permission>
            {permissionMessage(
              {
                permission: message.body.permission,
                status: message.body.status
              },
              intl
            )}
          </MessageBubble>
        ))}
      </ul>
    </li>
  );
}

PermissionMessageGroup.propTypes = {
  sent: PropTypes.bool,
  timestamp: PropTypes.any,
  messages: PropTypes.array
};

export const ChatMessageList = forwardRef(({ children, ...rest }, ref) => (
  <ul {...rest} className={styles.messageList} ref={ref}>
    {children}
  </ul>
));

ChatMessageList.propTypes = {
  children: PropTypes.node
};

ChatMessageList.displayName = "ChatMessageList";

export function ChatSidebar({ onClose, children, ...rest }) {
  return (
    <Sidebar
      title={<FormattedMessage id="chat-sidebar.title" defaultMessage="Чат" />}
      beforeTitle={<CloseButton onClick={onClose} />}
      contentClassName={styles.content}
      disableOverflowScroll
      {...rest}
    >
      {children}
    </Sidebar>
  );
}

ChatSidebar.propTypes = {
  onClose: PropTypes.func,
  onScrollList: PropTypes.func,
  children: PropTypes.node,
  listRef: PropTypes.func
};
