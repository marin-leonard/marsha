import { Button } from 'grommet';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  kickStudent: {
    defaultMessage: 'kick off user',
    description: 'Kick the student of the discussion',
    id: 'components.DashboardJoinDiscussion.kickStudent',
  },
});

interface DashboardJoinDiscussionKickButtonProps {
  video: Video;
  student: Student;
  onClick: (student: Student) => void;
}

interface Student {
  name: String;
  id: String;
}

export const DashboardJoinDiscussionKickButton = ({
  video,
  student,
  onClick,
}: DashboardJoinDiscussionKickButtonProps) => {

  const kickStudent = useCallback(async () => {
    const event = new CustomEvent('kick', { detail: { id: student.id } });
    window.dispatchEvent(event);
    onClick(student);
  }, [video]);

  return (
    <React.Fragment>
      <Button
        label={<FormattedMessage {...messages.kickStudent} />}
        primary={true}
        onClick={kickStudent}
        style={{ width: "100px !important", margin: "10px" }}
      />
    </React.Fragment>
  );
};