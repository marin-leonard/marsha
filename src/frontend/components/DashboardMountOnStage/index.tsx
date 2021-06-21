import { DashboardMountOnStageAcceptButton } from '../DashboardMountOnStageAcceptButton';
import { DashboardMountOnStageRejectButton } from '../DashboardMountOnStageRejectButton';
import { DashboardMountOnStageKickButton } from '../DashboardMountOnStageKickButton';
import { Box, Form, Heading, Text } from 'grommet';
import React, { lazy, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { appData } from '../../data/appData';
import { useVideo } from '../../data/stores/useVideo';
import { API_ENDPOINT } from '../../settings';
import { Video, liveState, LiveModeType } from '../../types/tracks';
import { report } from '../../utils/errors/report';

const messages = defineMessages({
  studentAsking: {
    defaultMessage:
      'is asking to mount on stage. Authorize him ?',
    description:
      'Message to inform the instructor that a student ask to mount on stage',
    id: 'components.DashboardMountOnStage.studentAsking',
  },
  studentOnStage: {
    defaultMessage:
      'is on stage.',
    description:
      'Message to inform the instructor that a student ask to mount on stage',
    id: 'components.DashboardMountOnStage.studentOnStage',
  },
});

interface DashboardMountOnStageProps {
  video: Video;
}

interface Student {
  name: String;
  id: String;
}

export const DashboardMountOnStage = ({ video }: DashboardMountOnStageProps) => {

  const [studentsAsking, setStudentsAsking] = useState<Student[]>([]);
  const [studentsOnStage, setStudentsOnStage] = useState<Student[]>([]);

  useEffect(() => {
    window.addEventListener('studentAsking', (params: any) => {
      console.log(params.detail.id);
      setStudentsAsking([...studentsAsking, { id: params.detail.id, name: params.detail.name }])
    });
    window.addEventListener('studentLeaving', (params: any) => {
      console.log(params.detail.id);
      setStudentsOnStage(studentsAsking.filter(item => item.id !== params.detail.id))
    });
  }, []);

  const onAccept = (student: Student) => {
    setStudentsOnStage([...studentsOnStage, student])
    setStudentsAsking(studentsAsking.filter(item => item.id !== student.id))
  }

  const onReject = (student: Student) => {
    setStudentsAsking(studentsAsking.filter(item => item.id !== student.id))
  }

  const onKick = (student: Student) => {
    setStudentsOnStage(studentsAsking.filter(item => item.id !== student.id))
  }

  return (
    <Box>
        {studentsAsking !== [] && 
          studentsAsking.map((student: Student) => {
            return (
              <Text>
                <Text>{student.name} </Text>
                <FormattedMessage {...messages.studentAsking}/>
                <DashboardMountOnStageAcceptButton video={video} student={student} onClick={onAccept}/>
                <DashboardMountOnStageRejectButton video={video} student={student} onClick={onReject}/>
              </Text>
            )
          })
        }
        {studentsOnStage !== [] && 
          studentsOnStage.map((student: Student) => {
            return (
              <Text>
                <Text>{student.name} </Text>
                <FormattedMessage {...messages.studentOnStage}/>
                <DashboardMountOnStageKickButton video={video} student={student} onClick={onKick}/>
              </Text>
            )
          })
        }
    </Box>
  );
};
