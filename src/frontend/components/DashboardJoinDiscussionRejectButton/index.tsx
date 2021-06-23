
import { Button } from 'grommet';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  rejectStudent: {
    defaultMessage: 'reject',
    description: 'Reject the student of the discussion',
    id: 'components.DashboardJoinDiscussion.rejectStudent',
  },
});

interface Student {
  name: String;
  id: String;
}

interface DashboardJoinDiscussionRejectButtonProps {
  video: Video;
  student: Student;
  onClick: (student: Student) => void;
}

export const DashboardJoinDiscussionRejectButton = ({
  video,
  student,
  onClick,
}: DashboardJoinDiscussionRejectButtonProps) => {

  const rejectStudent = useCallback(async () => {
    const event = new CustomEvent('reject', { detail: { id: student.id } });
    window.dispatchEvent(event);
    onClick(student)
  }, [video]);

  return (
    <React.Fragment>
      <Button
        label={<FormattedMessage {...messages.rejectStudent} />}
        onClick={rejectStudent}
        style={{ width: "100px !important", margin: "10px" }}
      />
    </React.Fragment>
  );
};
