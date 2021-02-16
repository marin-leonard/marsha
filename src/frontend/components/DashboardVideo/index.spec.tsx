import { render, screen } from '@testing-library/react';
import React from 'react';

import { LiveState, UploadState, Video } from '../../types/tracks';
import { videoMockFactory } from '../../utils/tests/factories';
import { wrapInIntlProvider } from '../../utils/tests/intl';
import DashboardVideo from '.';

jest.mock('../DashboardVideoPane', () => ({
  DashboardVideoPane: (props: { video: Video }) => (
    <span title={props.video.id} />
  ),
}));
jest.mock('../DashboardTimedTextPane', () => ({
  DashboardTimedTextPane: () => <span>dashboard timed text pane</span>,
}));
jest.mock('../../data/appData', () => ({
  appData: {
    video: {
      id: 'dd44',
      thumbnail: null,
      timed_text_tracks: [],
      upload_state: 'processing',
      live_state: null,
    },
  },
}));

describe('<DashboardVideo />', () => {
  it('renders', () => {
    const mockVideo = videoMockFactory({
      id: 'dd44',
      thumbnail: null,
      timed_text_tracks: [],
      upload_state: UploadState.PROCESSING,
    });

    render(wrapInIntlProvider(<DashboardVideo video={mockVideo} />));
    screen.getByTitle('dd44');
    screen.getByText('dashboard timed text pane');
  });

  it('defaults to the video from props', () => {
    const videoProps = videoMockFactory({
      id: 'dd43',
      thumbnail: null,
      timed_text_tracks: [],
      live_state: null,
      upload_state: UploadState.PROCESSING,
    });
    render(wrapInIntlProvider(<DashboardVideo video={videoProps} />));
    screen.getByTitle('dd43');
    screen.getByText('dashboard timed text pane');
  });

  it('hides timed text pane when it is a live', () => {
    const videoProps = videoMockFactory({
      id: 'dd43',
      thumbnail: null,
      timed_text_tracks: [],
      live_state: LiveState.IDLE,
      upload_state: UploadState.PENDING,
    });
    render(wrapInIntlProvider(<DashboardVideo video={videoProps} />));

    screen.getByTitle('dd43');
    expect(
      screen.queryByText('dashboard timed text pane'),
    ).not.toBeInTheDocument();
  });

  it('hides timed text pane when the upload state is DELETED', () => {
    const videoProps = videoMockFactory({
      id: 'dd43',
      upload_state: UploadState.DELETED,
    });
    render(wrapInIntlProvider(<DashboardVideo video={videoProps} />));

    screen.getByTitle('dd43');
    expect(
      screen.queryByText('dashboard timed text pane'),
    ).not.toBeInTheDocument();
  });

  it('hides timed text pane when the upload state is HARVESTING', () => {
    const videoProps = videoMockFactory({
      id: 'dd43',
      upload_state: UploadState.HARVESTING,
    });
    render(wrapInIntlProvider(<DashboardVideo video={videoProps} />));

    screen.getByTitle('dd43');
    expect(
      screen.queryByText('dashboard timed text pane'),
    ).not.toBeInTheDocument();
  });

  it('hides timed text pane when the upload state is HARVESTED', () => {
    const videoProps = videoMockFactory({
      id: 'dd43',
      upload_state: UploadState.HARVESTED,
    });
    render(wrapInIntlProvider(<DashboardVideo video={videoProps} />));

    screen.getByTitle('dd43');
    expect(
      screen.queryByText('dashboard timed text pane'),
    ).not.toBeInTheDocument();
  });
});
