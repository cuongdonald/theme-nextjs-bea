import { FunctionComponent, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { HighlightedStoryCard, StoryCard } from '@/components';
import { useCompanyInformation, useNewsroom } from '@/hooks';
import { StoryWithImage } from 'types';

import { useStoryCardLayout } from './lib';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    stories: StoryWithImage[];
    isCategoryList?: boolean;
};

const messages = defineMessages({
    noStoriesTitle: {
        defaultMessage: 'Welcome to {newsroom}!',
    },
    noStoriesSubtitle: {
        defaultMessage: 'Come back later to see new stories.',
    },
});

const StoriesList: FunctionComponent<Props> = ({ stories, isCategoryList = false }) => {
    const { name } = useCompanyInformation();
    const { display_name } = useNewsroom();

    const [highlightedStories, restStories] = useMemo(() => {
        if (isCategoryList) {
            return [[], stories];
        }
        // When there are only two stories, they should be both displayed as highlighted
        if (stories.length === 2) {
            return [stories, []];
        }

        return [stories.slice(0, 1), stories.slice(1)];
    }, [stories, isCategoryList]);

    const getStoryCardSize = useStoryCardLayout(isCategoryList, restStories.length);

    if (!highlightedStories.length && !restStories.length) {
        return (
            <div className={styles.noStories}>
                <Illustration />
                <h1 className={styles.noStoriesTitle}>
                    <FormattedMessage
                        {...messages.noStoriesTitle}
                        values={{ newsroom: name || display_name }}
                    />
                </h1>
                <p className={styles.noStoriesSubtitle}>
                    <FormattedMessage {...messages.noStoriesSubtitle} />
                </p>
            </div>
        );
    }

    return (
        <>
            {highlightedStories.length > 0 && (
                <div className={styles.highlightedStoriesContainer}>
                    {highlightedStories.map((story) => (
                        <HighlightedStoryCard key={story.uuid} story={story} />
                    ))}
                </div>
            )}
            {restStories.length > 0 && (
                <div className={styles.storiesContainer}>
                    {restStories.map((story, index) => (
                        <StoryCard key={story.uuid} story={story} size={getStoryCardSize(index)} />
                    ))}
                </div>
            )}
        </>
    );
};

export default StoriesList;
