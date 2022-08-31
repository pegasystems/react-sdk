import React from 'react';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

import { Utils } from '../../../helpers/utils';

declare const PCore: any;

const FieldGroupList = props => {
  let menuIconOverride$ = 'trash';
  if (menuIconOverride$) {
    menuIconOverride$ = Utils.getImageSrc(
      menuIconOverride$,
      PCore.getAssetLoader().getStaticServerUrl()
    );
  }

  return (
    <Grid container spacing={4} justifyContent='space-between'>
      <Grid item style={{ width: '100%' }}>
        <Grid container spacing={1}>
          {props.items.map(item => (
            <Grid item style={{ width: '100%' }}>
              <b>{item.name}</b>
              <button
                type='button'
                style={{ float: 'right' }}
                className='psdk-utility-button'
                id={`delete-row-${Utils.getLastChar(item.name)}`}
                onClick={() => {
                  props.onDelete(item.id);
                }}
              >
                <img className='psdk-utility-card-action-svg-icon' src={menuIconOverride$}></img>
              </button>
              {item.children}
              <br />
              <Divider />
              <br />
            </Grid>
          ))}
          <Link onClick={props.onAdd} style={{ cursor: 'pointer' }}>
            +Add
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FieldGroupList;
