import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react-lite';

interface IProps {
  string: string
  length: number
}

export default observer((props: IProps) => {
  const { string, length } = props;

  if (!string) {
    return null;
  }

  return (
    <div>
      <Tooltip
        placement="top"
        title={string}
        arrow
        interactive
        enterDelay={1000}
        enterNextDelay={1000}
      >
        <div className="truncate">{`${string.slice(
          0,
          length,
        )}......${string.slice(-length)}`}</div>
      </Tooltip>
    </div>
  );
});
