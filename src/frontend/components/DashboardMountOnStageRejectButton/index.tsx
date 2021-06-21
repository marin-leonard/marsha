
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Video } from '../../types/tracks';
import { DashboardButton } from '../DashboardPaneButtons';

const messages = defineMessages({
  rejectStudent: {
    defaultMessage: 'reject',
    description: 'Reject the student on stage',
    id: 'components.DashboardMountOnStage.rejectStudent',
  },
});

interface Student {
  name: String;
  id: String;
}

interface DashboardMountOnStageRejectButtonProps {
  video: Video;
  student: Student;
  onClick: (student: Student) => void;
}

export const DashboardMountOnStageRejectButton = ({
  video,
  student,
  onClick,
}: DashboardMountOnStageRejectButtonProps) => {

  const rejectStudent = useCallback(async () => {
    const event = new CustomEvent('reject', { detail: { id: student.id } });
    window.dispatchEvent(event);
    onClick(student)
  }, [video]);

  return (
    <React.Fragment>
      <DashboardButton
        label={<FormattedMessage {...messages.rejectStudent} />}
        onClick={rejectStudent}
      />
    </React.Fragment>
  );
};
