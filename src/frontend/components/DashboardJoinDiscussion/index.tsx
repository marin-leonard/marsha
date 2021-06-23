import { DashboardJoinDiscussionAcceptButton } from '../DashboardJoinDiscussionAcceptButton';
import { DashboardJoinDiscussionRejectButton } from '../DashboardJoinDiscussionRejectButton';
import { DashboardJoinDiscussionKickButton } from '../DashboardJoinDiscussionKickButton';
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
      'is asking to join the discussion.',
    description:
      'Message to inform the instructor that a student ask to join the discussion',
    id: 'components.DashboardJoinDiscussion.studentAsking',
  },
  studentInDiscussion: {
    defaultMessage:
      'is in the discussion.',
    description:
      'Message to inform the instructor that a student ask to join the discussion',
    id: 'components.DashboardJoinDiscussion.studentInDiscussion',
  },
});

interface DashboardJoinDiscussionProps {
  video: Video;
}

interface Student {
  name: String;
  id: String;
}

export const DashboardJoinDiscussion = ({ video }: DashboardJoinDiscussionProps) => {

  const [studentsAsking, setStudentsAsking] = useState<Student[]>([]);
  const [studentsInDiscussion, setStudentsInDiscussion] = useState<Student[]>([]);

  useEffect(() => {
    window.addEventListener('studentAsking', (params: any) => {
      console.log(params.detail.id);
      setStudentsAsking([...studentsAsking, { id: params.detail.id, name: params.detail.name }])
    });
    window.addEventListener('studentLeaving', (params: any) => {
      console.log(params.detail.id);
      setStudentsInDiscussion(studentsAsking.filter(item => item.id !== params.detail.id))
    });
  }, []);

  const onAccept = (student: Student) => {
    setStudentsInDiscussion([...studentsInDiscussion, student])
    setStudentsAsking(studentsAsking.filter(item => item.id !== student.id))
  }

  const onReject = (student: Student) => {
    setStudentsAsking(studentsAsking.filter(item => item.id !== student.id))
  }

  const onKick = (student: Student) => {
    setStudentsInDiscussion(studentsAsking.filter(item => item.id !== student.id))
  }

  return (
    <Box direction='column' margin='small'>
        {studentsAsking !== [] && 
          studentsAsking.map((student: Student) => {
            return (
              <Box direction='row' align='center' margin='small'>
                <Text style={{ fontWeight: 'bold', margin: '5px'}}>{student.name}{' '}</Text>
                <FormattedMessage {...messages.studentAsking}/>
                <DashboardJoinDiscussionAcceptButton video={video} student={student} onClick={onAccept}/>
                <DashboardJoinDiscussionRejectButton video={video} student={student} onClick={onReject}/>
              </Box>
            )
          })
        }
        {studentsInDiscussion !== [] && 
          studentsInDiscussion.map((student: Student) => {
            return (
              <Box direction='row' align='center' margin='small'>
                <Text style={{ fontWeight: 'bold', margin: '5px'}}>{student.name}{' '}</Text>
                <FormattedMessage {...messages.studentInDiscussion}/>
                <DashboardJoinDiscussionKickButton video={video} student={student} onClick={onKick}/>
              </Box>
            )
          })
        }
    </Box>
  );
};
