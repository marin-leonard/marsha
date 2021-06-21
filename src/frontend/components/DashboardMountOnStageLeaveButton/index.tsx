import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { Document } from '../../types/file';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  askInstructor: {
    defaultMessage: 'Leave',
    description: 'Leave the stage',
    id: 'components.DashboardMountOnStage.leaveStage',
  },
});

interface DashboardMountOnStageLeaveButtonProps {
  video: Video | Document;
  onClick: () => void;
}

export const DashboardMountOnStageLeaveButton = ({
  video,
  onClick,
}: DashboardMountOnStageLeaveButtonProps) => {

  const askInstructor = useCallback(async () => {
    const event = new Event('leave');
    window.dispatchEvent(event);
    onClick()
  }, [video]);

  return (
    <React.Fragment>
      <DashboardButton
        label={<FormattedMessage {...messages.askInstructor} />}
        primary={true}
        onClick={askInstructor}
      />
    </React.Fragment>
  );
};