import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styles from "./RoomSettingsSidebar.scss";
import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { InputField } from "../input/InputField";
import { FormattedMessage, useIntl } from "react-intl";
import { ApplyButton } from "../input/Button";
import { TextInputField } from "../input/TextInputField";
import { TextAreaInputField } from "../input/TextAreaInputField";
import { ToggleInput } from "../input/ToggleInput";
import { RadioInputField, RadioInputOption } from "../input/RadioInputField";
import { NumericInputField } from "../input/NumericInputField";
import { BackButton } from "../input/BackButton";
import { SceneInfo } from "./RoomSidebar";
import { Column } from "../layout/Column";
import { InviteLinkInputField } from "./InviteLinkInputField";

export function RoomSettingsSidebar({
  showBackButton,
  accountId,
  room,
  fetchingInvite,
  inviteUrl,
  onRevokeInvite,
  maxRoomSize,
  showPublicRoomSetting,
  onSubmit,
  onClose,
  canChangeScene,
  onChangeScene
}) {
  const intl = useIntl();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: room
  });

  const entryMode = watch("entry_mode");
  const spawnAndMoveMedia = watch("member_permissions.spawn_and_move_media");

  useEffect(() => {
    if (!spawnAndMoveMedia) {
      setValue("member_permissions.spawn_camera", false, { shouldDirty: true });
      setValue("member_permissions.pin_objects", false, { shouldDirty: true });
    }
  }, [spawnAndMoveMedia, setValue]);

  return (
    <Sidebar
      title={<FormattedMessage id="room-settings-sidebar.title" defaultMessage="Параметры комнаты" />}
      beforeTitle={showBackButton ? <BackButton onClick={onClose} /> : <CloseButton onClick={onClose} />}
    >
      <Column padding as="form" onSubmit={handleSubmit(onSubmit)}>
        <SceneInfo
          accountId={accountId}
          scene={room.scene}
          canChangeScene={canChangeScene}
          onChangeScene={onChangeScene}
        />
        <TextInputField
          type="text"
          required
          autoComplete="off"
          placeholder={intl.formatMessage({
            id: "room-settings-sidebar.name-placeholder",
            defaultMessage: "Имя комнаты"
          })}
          minLength={1}
          maxLength={64}
          label={<FormattedMessage id="room-settings-sidebar.name" defaultMessage="Имя комнаты" />}
          error={errors?.name?.message}
          fullWidth
          {...register("name")}
        />
        <TextAreaInputField
          autoComplete="off"
          placeholder={intl.formatMessage({
            id: "room-settings-sidebar.description-placeholder",
            defaultMessage: "Описание комнаты"
          })}
          label={<FormattedMessage id="room-settings-sidebar.description" defaultMessage="Описание комнаты" />}
          minRows={3}
          error={errors?.description?.message}
          fullWidth
          {...register("description")}
        />
        <NumericInputField
          required
          min={0}
          max={maxRoomSize}
          placeholder={intl.formatMessage({
            id: "room-settings-sidebar.room-size-placeholder",
            defaultMessage: "Лимит участников"
          })}
          label={<FormattedMessage id="room-settings-sidebar.room-size" defaultMessage="Размер комнаты" />}
          error={errors?.room_size?.message}
          fullWidth
          {...register("room_size")}
        />
        <RadioInputField
          label={<FormattedMessage id="room-settings-sidebar.room-access" defaultMessage="Доступ в комнату" />}
          fullWidth
        >
          <RadioInputOption
            value="allow"
            label={<FormattedMessage id="room-settings-sidebar.access-shared-link" defaultMessage="Общая ссылка" />}
            description={
              <FormattedMessage
                id="room-settings-sidebar.access-shared-link-description"
                defaultMessage="Присоединиться могут только те, у кого есть ссылка"
              />
            }
            error={errors?.entry_mode?.message}
            {...register("entry_mode")}
          />
          <RadioInputOption
            value="invite"
            label={
              <FormattedMessage id="room-settings-sidebar.access-invite" defaultMessage="Только по приглашениям" />
            }
            description={
              <FormattedMessage
                id="room-settings-sidebar.access-invite-description"
                defaultMessage="Приглашать людей с помощью ссылки, которая может быть отозвана"
              />
            }
            error={errors?.entry_mode?.message}
            {...register("entry_mode")}
          />
        </RadioInputField>
        {entryMode === "invite" && (
          <InviteLinkInputField fetchingInvite={fetchingInvite} inviteUrl={inviteUrl} onRevokeInvite={onRevokeInvite} />
        )}
        {showPublicRoomSetting && (
          <ToggleInput
            label={<FormattedMessage id="room-settings-sidebar.access-public" defaultMessage="Публичный" />}
            description={
              <FormattedMessage
                id="room-settings-sidebar.access-public-description"
                defaultMessage="Размещено на главной странице"
              />
            }
            {...register("allow_promotion")}
          />
        )}
        <InputField
          label={<FormattedMessage id="room-settings-sidebar.permissions" defaultMessage="Полномочия членов комнаты" />}
          fullWidth
        >
          <div className={styles.roomPermissions}>
            <ToggleInput
              label={<FormattedMessage id="room-settings-sidebar.voice-chat" defaultMessage="Голосовой чат" />}
              {...register("member_permissions.voice_chat")}
            />
            <ToggleInput
              label={<FormattedMessage id="room-settings-sidebar.text-chat" defaultMessage="Текстовый чат" />}
              {...register("member_permissions.text_chat")}
            />
            <ToggleInput
              label={
                <FormattedMessage
                  id="room-settings-sidebar.spawn-and-move-media"
                  defaultMessage="Создавай и перемещай объекты"
                />
              }
              {...register("member_permissions.spawn_and_move_media")}
            />
            <div className={styles.permissionsGroup}>
              <ToggleInput
                label={<FormattedMessage id="room-settings-sidebar.spawn-camera" defaultMessage="Создание камер" />}
                disabled={!spawnAndMoveMedia}
                {...register("member_permissions.spawn_camera")}
              />
              <ToggleInput
                label={<FormattedMessage id="room-settings-sidebar.pin-objects" defaultMessage="Закрепить объект" />}
                disabled={!spawnAndMoveMedia}
                {...register("member_permissions.pin_objects")}
              />
            </div>
            <ToggleInput
              label={<FormattedMessage id="room-settings-sidebar.spawn-drawing" defaultMessage="Создать рисунок" />}
              {...register("member_permissions.spawn_drawing")}
            />
            <ToggleInput
              label={<FormattedMessage id="room-settings-sidebar.spawn-emoji" defaultMessage="Создать рисунок" />}
              {...register("member_permissions.spawn_emoji")}
            />
            <ToggleInput
              label={<FormattedMessage id="room-settings-sidebar.fly" defaultMessage="Разрешить полёт" />}
              {...register("member_permissions.fly")}
            />
          </div>
        </InputField>
        <ApplyButton type="submit" />
      </Column>
    </Sidebar>
  );
}

RoomSettingsSidebar.propTypes = {
  accountId: PropTypes.string,
  showBackButton: PropTypes.bool,
  room: PropTypes.object.isRequired,
  fetchingInvite: PropTypes.bool,
  inviteUrl: PropTypes.string,
  onRevokeInvite: PropTypes.func,
  roomSize: PropTypes.number,
  maxRoomSize: PropTypes.number,
  showPublicRoomSetting: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  canChangeScene: PropTypes.bool,
  onChangeScene: PropTypes.func
};
