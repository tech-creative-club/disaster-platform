import React, { Fragment } from 'react';
import Drawer from '@mui/material/Drawer';

interface Props {
  [key: string]: any;
}
export default function ProvideInformationDrawer(props: Props): React.JSX.Element {
  return (
    <Fragment>
      <Drawer anchor="left" open={props.menuState} className="overflow-hidden" {...props}>
        <span>test</span>
      </Drawer>
    </Fragment>
  );
}
