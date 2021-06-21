import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  kickStudent: {
    defaultMessage: 'kick',
    description: 'Kick the student of the stream',
    id: 'components.DashboardMountOnStage.kickStudent',
  },
});

interface DashboardMountOnStageKickButtonProps {
  video: Video;
  student: Student;
  onClick: (student: Student) => void;
}

interface Student {
  name: String;
  id: String;
}

export const DashboardMountOnStageKickButton = ({
  video,
  student,
  onClick,
}: DashboardMountOnStageKickButtonProps) => {

  const kickStudent = useCallback(async () => {
    const event = new CustomEvent('kick', { detail: { id: student.id } });
    window.dispatchEvent(event);
    onClick(student);
  }, [video]);

  return (
    <React.Fragment>
      <DashboardButton
        label={<FormattedMessage {...messages.kickStudent} />}
        primary={true}
        onClick={kickStudent}
      />
    </React.Fragment>
  );
};