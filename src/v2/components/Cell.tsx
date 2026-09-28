import { Block, CellOptions, EmptyCell } from '../types';

interface Props {
  type: CellOptions;
  isGhost?: boolean;
  ghostType?: Block | null;
  isClearing?: boolean;
}

function Cell({ type, isGhost, ghostType, isClearing }: Props) {
  let classes = 'cell';

  if (isClearing) {
    classes += ' clearing';
  } else if (isGhost && ghostType) {
    classes += ` ghost ghost-${ghostType}`;
  } else if (type !== EmptyCell.Empty) {
    classes += ` block block-${type}`;
  } else {
    classes += ' empty';
  }

  return <div className={classes} />;
}

export default Cell;
