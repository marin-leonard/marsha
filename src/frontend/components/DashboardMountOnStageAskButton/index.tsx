import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { Document } from '../../types/file';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  askInstructor: {
    defaultMessage: 'Mount On Stage',
    description: 'Ask to mount on stage',
    id: 'components.DashboardMountOnStage.askInstructor',
  },
});

interface DashboardMountOnStageAskButtonProps {
  video: Video | Document;
  onClick: () => void;
}

export const DashboardMountOnStageAskButton = ({
  video,
  onClick,
}: DashboardMountOnStageAskButtonProps) => {

  const askInstructor = useCallback(async () => {
    const event = new Event('asktomount');
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