import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Pitch from './soccer/Pitch'
import MatchStats from './soccer/match-stats'
import Momentum from './soccer/Momentum'
import Chalkboard from './soccer/Chalkboard'
import PassingNetwork from './soccer/PassingNetwork'
import PlayerStats from './soccer/PlayerStats'
import XGMatchStory from './soccer/XGMatchStory'
import TouchHeatmaps from './soccer/TouchHeatmaps'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  Pitch,
  MatchStats,
  Momentum,
  Chalkboard,
  PassingNetwork,
  PlayerStats,
  XGMatchStory,
  TouchHeatmaps,
}
