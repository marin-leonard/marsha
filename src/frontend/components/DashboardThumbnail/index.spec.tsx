import { act, fireEvent, render } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';
import { ImportMock } from 'ts-mock-imports';

import { DashboardThumbnail } from '.';
import * as useThumbnailModule from '../../data/stores/useThumbnail';
import { UploadState } from '../../types/tracks';
import { Deferred } from '../../utils/tests/Deferred';
import { videoMockFactory } from '../../utils/tests/factories';
import { wrapInIntlProvider } from '../../utils/tests/intl';

jest.mock('react-router-dom', () => ({
  Redirect: ({ to }: { to: string }) => `Redirect push to ${to}.`,
}));

jest.mock('../../data/appData', () => ({
  appData: {
    jwt: 'some token',
  },
}));

const mockAddThumbnail = jest.fn();

const useThumbnailStub = ImportMock.mockFunction(
  useThumbnailModule,
  'useThumbnail',
);

describe('<DashboardThumbnail />', () => {
  afterEach(jest.resetAllMocks);

  afterAll(useThumbnailStub.restore);

  it('displays a thumbnail image when the related Thumbnail object is ready', () => {
    const video = videoMockFactory({
      id: '43',
      is_ready_to_show: true,
      show_download: true,
      thumbnail: {
        active_stamp: 128748302847,
        id: '42',
        is_ready_to_show: true,
        upload_state: UploadState.READY,
        urls: {
          144: 'https://example.com/thumbnail/144',
          240: 'https://example.com/thumbnail/240',
          480: 'https://example.com/thumbnail/480',
          720: 'https://example.com/thumbnail/720',
          1080: 'https://example.com/thumbnail/1080',
        },
        video: '43',
      },
      upload_state: UploadState.READY,
    });

    useThumbnailStub.returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: video.thumbnail,
    });

    const { getByAltText, queryByText } = render(
      wrapInIntlProvider(<DashboardThumbnail video={video} />),
    );

    // The progress indicator, processing message & error message are not shown
    expect(queryByText('0%')).toEqual(null);
    expect(
      queryByText(
        'Your thumbnail is currently processing. This may take several minutes. It will appear here once done.',
      ),
    ).toEqual(null);
    expect(
      queryByText('There was an error during thumbnail creation.'),
    ).toEqual(null);
    // The thumbnail image is shown
    expect(
      getByAltText('Video thumbnail preview image.').getAttribute('src'),
    ).toEqual('https://example.com/thumbnail/144');
    useThumbnailStub.reset();
  });

  it('displays a thumbnail image with the autogenerated default thumbnail when there is no Thumbnail resource', () => {
    const videoWithoutThumbnail = videoMockFactory({
      id: '43',
      is_ready_to_show: true,
      show_download: true,
      thumbnail: null,
      upload_state: UploadState.READY,
    });
    useThumbnailStub.returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: null,
    });

    const { getByAltText, queryByText } = render(
      wrapInIntlProvider(<DashboardThumbnail video={videoWithoutThumbnail} />),
    );

    // The progress indicator, processing message & error message are not shown
    expect(queryByText('0%')).toEqual(null);
    expect(
      queryByText(
        'Your thumbnail is currently processing. This may take several minutes. It will appear here once done.',
      ),
    ).toEqual(null);
    expect(
      queryByText('There was an error during thumbnail creation.'),
    ).toEqual(null);
    // The thumbnail image is shown
    expect(
      getByAltText('Video thumbnail preview image.').getAttribute('src'),
    ).toEqual('https://example.com/default_thumbnail/144');
    useThumbnailStub.reset();
  });

  it('displays a progress bar when the Thumbnail status is uploading', () => {
    const videoWithLoadingThumbnail = videoMockFactory({
      id: '43',
      is_ready_to_show: true,
      show_download: true,
      thumbnail: {
        active_stamp: 128748302847,
        id: '42',
        is_ready_to_show: true,
        upload_state: UploadState.UPLOADING,
        urls: {
          144: 'https://example.com/thumbnail/144',
          240: 'https://example.com/thumbnail/240',
          480: 'https://example.com/thumbnail/480',
          720: 'https://example.com/thumbnail/720',
          1080: 'https://example.com/thumbnail/1080',
        },
        video: '43',
      },
      upload_state: UploadState.READY,
    });

    useThumbnailStub.returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: videoWithLoadingThumbnail.thumbnail,
    });

    const { getByText, queryByAltText, queryByText } = render(
      wrapInIntlProvider(
        <DashboardThumbnail video={videoWithLoadingThumbnail} />,
      ),
    );

    // The thumbnail image, processing message & error message are not shown
    expect(queryByAltText('Video thumbnail preview image.')).toEqual(null);
    expect(
      queryByText(
        'Your thumbnail is currently processing. This may take several minutes. It will appear here once done.',
      ),
    ).toEqual(null);
    expect(
      queryByText('There was an error during thumbnail creation.'),
    ).toEqual(null);
    // The progress indicator is shown
    getByText('0%');
    useThumbnailStub.reset();
  });

  it('displays an explanatory message when a thumbnail is processing', () => {
    const videoWithProcessingThumbnail = videoMockFactory({
      id: '43',
      is_ready_to_show: true,
      show_download: true,
      thumbnail: {
        active_stamp: 128748302847,
        id: '42',
        is_ready_to_show: true,
        upload_state: UploadState.PROCESSING,
        urls: {
          144: 'https://example.com/thumbnail/144',
          240: 'https://example.com/thumbnail/240',
          480: 'https://example.com/thumbnail/480',
          720: 'https://example.com/thumbnail/720',
          1080: 'https://example.com/thumbnail/1080',
        },
        video: '43',
      },
      upload_state: UploadState.READY,
    });

    useThumbnailStub.returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: videoWithProcessingThumbnail.thumbnail,
    });

    const { getByText, queryByAltText, queryByText } = render(
      wrapInIntlProvider(
        <DashboardThumbnail video={videoWithProcessingThumbnail} />,
      ),
    );

    // The thumbnail image, progress indicator & error message are not shown
    expect(queryByAltText('Video thumbnail preview image.')).toEqual(null);
    expect(queryByText('0%')).toEqual(null);
    expect(
      queryByText('There was an error during thumbnail creation.'),
    ).toEqual(null);
    // The processing message is shown
    getByText(
      'Your thumbnail is currently processing. This may take several minutes. It will appear here once done.',
    );
    useThumbnailStub.reset();
  });

  it('displays an error message when there is an issue with a thumbnail', () => {
    const videoWithErroredThumbnail = videoMockFactory({
      id: '43',
      is_ready_to_show: true,
      show_download: true,
      thumbnail: {
        active_stamp: 128748302847,
        id: '42',
        is_ready_to_show: true,
        upload_state: UploadState.ERROR,
        urls: {
          144: 'https://example.com/thumbnail/144',
          240: 'https://example.com/thumbnail/240',
          480: 'https://example.com/thumbnail/480',
          720: 'https://example.com/thumbnail/720',
          1080: 'https://example.com/thumbnail/1080',
        },
        video: '43',
      },
      upload_state: UploadState.READY,
    });

    useThumbnailStub.returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: videoWithErroredThumbnail.thumbnail,
    });

    const { getByText, queryByAltText, queryByText } = render(
      wrapInIntlProvider(
        <DashboardThumbnail video={videoWithErroredThumbnail} />,
      ),
    );

    // The thumbnail image, progress indicator & processing message are not shown
    expect(queryByAltText('Video thumbnail preview image.')).toEqual(null);
    expect(queryByText('0%')).toEqual(null);
    expect(
      queryByText(
        'Your thumbnail is currently processing. This may take several minutes. It will appear here once done.',
      ),
    ).toEqual(null);
    // The error message is shown
    getByText('There was an error during thumbnail creation.');
    useThumbnailStub.reset();
  });

  it('creates a new thumbnail and redirects the user to the upload form they click on the replace button', async () => {
    const deferred = new Deferred();
    fetchMock.mock('/api/thumbnails/', deferred.promise, {
      method: 'POST',
    });
    const videoWithoutThumbnail = videoMockFactory({
      id: '43',
      is_ready_to_show: true,
      show_download: true,
      thumbnail: null,
      upload_state: UploadState.READY,
    });

    useThumbnailStub.onCall(0).returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: null,
    });
    useThumbnailStub.onCall(1).returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: null,
    });

    useThumbnailStub.returns({
      addThumbnail: mockAddThumbnail,
      thumbnail: {
        id: '42',
      },
    });

    const { getByAltText, getByText } = render(
      wrapInIntlProvider(<DashboardThumbnail video={videoWithoutThumbnail} />),
    );

    expect(
      getByAltText('Video thumbnail preview image.').getAttribute('src'),
    ).toEqual('https://example.com/default_thumbnail/144');

    fireEvent.click(getByText('Replace this thumbnail'));
    await act(async () =>
      deferred.resolve(
        JSON.stringify({
          active_stamp: 128748302847,
          id: '42',
          is_ready_to_show: true,
          upload_state: UploadState.READY,
          urls: {
            144: 'https://example.com/thumbnail/144',
            240: 'https://example.com/thumbnail/240',
            480: 'https://example.com/thumbnail/480',
            720: 'https://example.com/thumbnail/720',
            1080: 'https://example.com/thumbnail/1080',
          },
          video: '43',
        }),
      ),
    );
    expect(fetchMock.calls()).toHaveLength(1);

    expect(fetchMock.lastCall()![0]).toEqual('/api/thumbnails/');
    expect(fetchMock.lastCall()![1]!.headers).toEqual({
      Authorization: 'Bearer some token',
      'Content-Type': 'application/json',
    });
    expect(mockAddThumbnail).toHaveBeenCalled();
    getByText('Redirect push to /form/thumbnails/42.');
    useThumbnailStub.reset();
  });
});
