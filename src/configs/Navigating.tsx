import {Navigation} from "@toolpad/core/AppProvider";
import HomeIcon from '@mui/icons-material/Home';
import ShortTextIcon from "@mui/icons-material/ShortText";
import TagIcon from "@mui/icons-material/Tag";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export const NAVIGATION: Navigation = [
  {
    segment: '',
    title: 'Home',
    icon: <HomeIcon/>,
  },

  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'knowledge',
  },
  {
    segment: 'terms',
    title: 'Terms',
    icon: <ShortTextIcon/>,
  },
  {
    segment: 'tags',
    title: 'Tags',
    icon: <TagIcon/>,
  },
  {
    segment: 'news',
    title: 'News',
    icon: <TextSnippetIcon/>,
  },
  {
    segment: 'thinkings',
    title: 'Thinkings',
    icon: <TipsAndUpdatesIcon/>,
  }
];