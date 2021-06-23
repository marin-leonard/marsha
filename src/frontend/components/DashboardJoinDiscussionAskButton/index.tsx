import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { Document } from '../../types/file';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  askInstructor: {
    defaultMessage: 'Send request to join the discussion',
    description: 'Ask the instructor to join the discussion',
    id: 'components.DashboardJoinDiscussion.askInstructor',
  },
});

interface DashboardJoinDiscussionAskButtonProps {
  video: Video | Document;
  onClick: () => void;
}

export const DashboardJoinDiscussionAskButton = ({
  video,
  onClick,
}: DashboardJoinDiscussionAskButtonProps) => {

  const askInstructor = useCallback(async () => {
    const event = new Event('asktomount');
    window.dispatchEvent(event);
    onClick()
  }, [video]);

  return (
    <React.Fragment >
      <DashboardButton
        label={<FormattedMessage {...messages.askInstructor} />}
        primary={true}
        onClick={askInstructor}
      />
    </React.Fragment>
  );
};