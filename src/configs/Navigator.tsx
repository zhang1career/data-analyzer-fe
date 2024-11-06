import {Navigation} from "@toolpad/core/AppProvider";
import HomeIcon from '@mui/icons-material/Home';
import ShortTextIcon from "@mui/icons-material/ShortText";
import TagIcon from "@mui/icons-material/Tag";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

export const NAVIGATION: Navigation = [
  {
    segment: 'home',
    title: 'Home',
    icon: <HomeIcon />,
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
    icon: <ShortTextIcon />,
  },
  {
    segment: 'tags',
    title: 'Tags',
    icon: <TagIcon />,
  },
  {
    segment: 'news',
    title: 'News',
    icon: <TextSnippetIcon />,
  }
];