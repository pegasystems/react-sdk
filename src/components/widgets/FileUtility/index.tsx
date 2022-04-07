import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Utils } from "../../../helpers/utils";
import download from "downloadjs";
import SummaryList from '../../widgets/SummaryList'
import './FileUtility.css';
import  { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

declare const PCore;
const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));


export default function FileUtility(props) {
  const classes = useStyles();
  const { getPConnect } = props;
  const thePConn = getPConnect();
  const { label } = props;
  let arFullListAttachments: Array<any> = [];
  let arItems: any = [];
  let attachmentsCount = 0;
  const [file, setFile] = useState([]);
  console.log('file', file);
  const headerSvgIcon$ = Utils.getImageSrc('paper-clip', PCore.getAssetLoader().getStaticServerUrl());
  const configProps: any = thePConn.resolveConfigProps(thePConn.getConfigProps());
  const header = configProps.label;
  console.log('name', header);
  const options = ['Add files', 'Add links'];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function addAttachments(attsFromResp: Array<any> = [], attachedFileID: string = "") {
    // this.lu_bLoading$ = false;

     attsFromResp = attsFromResp.map((respAtt) => {
       const updatedAtt = {
         ...respAtt,
         meta: `${respAtt.category} . ${Utils.generateDateTime(respAtt.createTime, "DateTime-Since")}, ${
           respAtt.createdBy
         }`
       };
       if (updatedAtt.type === "FILE") {
         updatedAtt.nameWithExt = updatedAtt.fileName;
       }
       return updatedAtt;
     });


     return attsFromResp;

  }

  const getAttachments = () => {

    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    if (caseID && caseID !== "") {
      let attPromise = attachmentUtils.getCaseAttachments(caseID, thePConn.getContextName());

      attPromise
        .then( (resp) => {
          console.log('resp attachment', resp);
          arFullListAttachments = addAttachments(resp);
          attachmentsCount = arFullListAttachments.length;
         // this.lu_arActions$ = this.addAttachmentsActions;

          arItems = arFullListAttachments.slice(0, 3).map((att) => {
            return getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => downloadFile(att) : null,
              cancelFile: att.progress ? () => cancelFile(att.ID) : null,
              deleteFile: !att.progress ? () => deleteFile(att) : null,
              removeFile: att.error ? () => removeFile(att.ID) : null
            });
          });
          setFile(arItems);
          console.log('file', file);
          // this.va_arItems$ = arFullListAttachments.map((att) => {
          //   return getListUtilityItemProps({
          //     att,
          //     downloadFile: !att.progress ? () => downloadFile(att) : null,
          //     cancelFile: att.progress ? () => cancelFile(att.ID) : null,
          //     deleteFile: !att.progress ? () => deleteFile(att) : null,
          //     removeFile: att.error ? () => removeFile(att.ID) : null
          //   });
          // });
        });
    }



  }

  function getListUtilityItemProps({
    att,
    cancelFile,
    downloadFile,
    deleteFile,
    removeFile
  }) {
    let actions;


    if (att.progress && att.progress !== 100) {
      actions = [
        {
          id: `Cancel-${att.ID}`,
          text: "Cancel",
          icon: "times",
          onClick: cancelFile
        }
      ];
    } else if (att.links) {
      const isFile = att.type === "FILE";
      const ID = att.ID.replace(/\s/gi, "");
      const actionsMap = new Map([
        [
          "download",
          {
            id: `download-${ID}`,
            text: isFile ? "Download" : "Open",
            icon: isFile ? "download" : "open",
            onClick: downloadFile
          }
        ],
        [
          "delete",
          {
            id: `Delete-${ID}`,
            text: "Delete",
            icon: "trash",
            onClick: deleteFile
          }
        ]
      ]);
      actions = [];
      actionsMap.forEach((action, actionKey) => {
        if (att.links[actionKey]) {
          actions.push(action);
        }
      });
    } else if (att.error) {
      actions = [
        {
          id: `Remove-${att.ID}`,
          text: "Remove",
          icon: "trash",
          onClick: removeFile
        }
      ];
    }

    return {
      id: att.ID,
      visual: {
        icon: Utils.getIconForAttachment(att),
        progress: att.progress == 100 ? undefined: att.progress,
      },
      primary: {
        type: att.type,
        name: att.name,
        icon: "open",
        click: downloadFile,
      },
      secondary: {
        text: att.meta
      },
      actions
    };
  }


  useEffect(() => {
    console.log("executed only once!");
    getAttachments();
  }, [""]);

  function downloadFile(att: any) {


    let attachUtils = PCore.getAttachmentUtils();
    const {ID, name, extension, type} = att;
    let context = PCore.getContextName();

    attachUtils
    .downloadAttachment(ID, context)
    .then((content) => {
      if (type === "FILE") {
        fileDownload(content.data, name, extension);
      } else if (type === "URL") {
        let { data } = content;
        if (!/^(http|https):\/\//.test(data)) {
          data = `//${data}`;
        }
        window.open(content.data, "_blank");
      }
    })
    .catch(console.error);
  }

  function fileDownload(data, fileName, ext) {
    const file = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), file);
  };

  function cancelFile(attID: string) {
    alert("cancel");
  }

  function removeFile(attID: string) {
    alert("remove");
  }

  function deleteFile(att: any) {

    setTimeout(() => {
      let attachUtils = PCore.getAttachmentUtils();
      const {ID} = att;
      let context = PCore.getContextName();

      attachUtils
      .deleteAttachment(ID, context)
      .then(() => {
        // this.updateSelf();
        // let newAttachments;
        // setAttachments((current) => {
        //   newAttachments = current.filter((file) => file.ID !== ID);
        //   return newAttachments;
        // });
        // if (callbackFn) {
        //   callbackFn(newAttachments);
        // }
      })
      .catch(console.error);
    });


  }

  let content = (
    <Card id="FileUtility" className={classes.root} >
      FileUtility<br />
      name: {label}
    </Card>
  )

  if (file && file.length > 0) {
    // let progressValue = file.props.progress;
    // content = (<div className="file-display">
    //   <SummaryList menuIconOverride$='trash' arItems$={file.props.arFileList$}></SummaryList>
    // </div>)
    content = (
      <div>
       <SummaryList arItems$={file}></SummaryList>

      </div>
    );
  }

  return (
    <div className="psdk-utility">
      <div className="psdk-header">
        <img className="psdk-file-utility-card-svg-icon" src={headerSvgIcon$}></img>
        <div className="header-text">{header}</div>
        <div className="psdk-utility-count">{attachmentsCount}</div>
        <div>
          <IconButton
            id="long-button"
            // aria-controls={open ? 'long-menu' : undefined}
            // aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            // MenuListProps={{
            //   'aria-labelledby': 'long-button',
            // }}
            // anchorEl={anchorEl}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
          >
            {options.map((option) => (
              <MenuItem key={option} selected={option === 'Pyxis'}>
                {option}
              </MenuItem>
            ))}
          </Menu>
    </div>
      </div>
    </div>
    // <div>{content}</div>

  )
}

FileUtility.defaultProps = {
  // lastRefreshTime: ""
};

FileUtility.propTypes = {
  label: PropTypes.string.isRequired,
  // getPConnect: PropTypes.func.isRequired,
  // lastRefreshTime: PropTypes.string
};
