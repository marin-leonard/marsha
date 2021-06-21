import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  acceptStudent: {
    defaultMessage: 'accept',
    description: 'Accept the student on stage',
    id: 'components.DashboardMountOnStage.acceptStudent',
  },
});

interface DashboardMountOnStageAcceptButtonProps {
  video: Video;
  student: Student;
  onClick: (student: Student) => void;
}

interface Student {
  name: String;
  id: String;
}

export const DashboardMountOnStageAcceptButton = ({
  video,
  student,
  onClick,
}: DashboardMountOnStageAcceptButtonProps) => {

  const acceptStudent = useCallback(async () => {
    const event = new CustomEvent('accept', { detail: { id: student.id } });
    window.dispatchEvent(event);
    onClick(student)
  }, [video]);

  return (
    <React.Fragment>
      <DashboardButton
        label={<FormattedMessage {...messages.acceptStudent} />}
        primary={true}
        onClick={acceptStudent}
      />
    </React.Fragment>
  );
};