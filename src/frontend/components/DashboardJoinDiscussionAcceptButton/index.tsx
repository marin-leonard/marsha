import { Button } from 'grommet';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  acceptStudent: {
    defaultMessage: 'accept',
    description: 'Accept the student in the discussion',
    id: 'components.DashboardJoinDiscussion.acceptStudent',
  },
});

interface DashboardJoinDiscussionAcceptButtonProps {
  video: Video;
  student: Student;
  onClick: (student: Student) => void;
}

interface Student {
  name: String;
  id: String;
}

export const DashboardJoinDiscussionAcceptButton = ({
  video,
  student,
  onClick,
}: DashboardJoinDiscussionAcceptButtonProps) => {

  const acceptStudent = useCallback(async () => {
    const event = new CustomEvent('accept', { detail: { id: student.id } });
    window.dispatchEvent(event);
    onClick(student)
  }, [video]);

  return (
    <React.Fragment>
      <Button
        label={<FormattedMessage {...messages.acceptStudent} />}
        primary={true}
        onClick={acceptStudent}
        style={{ width: "100px !important", margin: "10px" }}
      />
    </React.Fragment>
  );
};