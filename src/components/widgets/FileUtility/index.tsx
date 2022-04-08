import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Utils } from "../../../helpers/utils";
import download from "downloadjs";
import SummaryList from '../../widgets/SummaryList';
import ActionButtons from '../ActionButtons';
import './FileUtility.css';
import  { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import { validateMaxSize } from '../../Attachment/AttachmentUtils';

declare const PCore;

export default function FileUtility(props) {
  const { getPConnect } = props;
  const thePConn = getPConnect();
  const required = true;
  const listTemp = {
    data: [],
    count: 0
  };
  const [list, setList] = useState(listTemp);
  const headerSvgIcon$ = Utils.getImageSrc('paper-clip', PCore.getAssetLoader().getStaticServerUrl());
  const configProps: any = thePConn.resolveConfigProps(thePConn.getConfigProps());
  const header = configProps.label;
  const fileTemp = {
    showfileModal: false,
    fileList: [],
    attachedFiles: [],
    fileMainButtons: [{ actionID: "attach", jsAction: "attachFiles", name: "Attach files"}],
    fileSecondaryButtons: [{ actionID: "cancel", jsAction: "cancel", name: "Cancel"}]
  };
  const [fileData, setFileData] = useState(fileTemp);
  const linkTemp = {
    showLinkModal: false,
    linksList: [],
    attachedLinks: [],
    linkMainButtons: [{ actionID: "attach", jsAction: "attachLinks", name: "Attach links"}],
    linkSecondaryButtons: [{ actionID: "cancel", jsAction: "cancel", name: "Cancel"}]
  };
  const [linkData, setLinkData] = useState(linkTemp);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  function addAttachments(attsFromResp: Array<any> = []) {
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
        progress: att.progress === 100 ? undefined: att.progress,
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

  function fileDownload(data, fileName, ext) {
    const file = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), file);
  };

  function downloadAttachedFile(att: any) {
    const attachUtils = PCore.getAttachmentUtils();
    const {ID, name, extension, type} = att;
    const context = thePConn.getContextName();

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
    .catch();
  }

  function deleteAttachedFile(att: any) {
    const attachUtils = PCore.getAttachmentUtils();
    const {ID} = att;
    const context = thePConn.getContextName();

    attachUtils.deleteAttachment(ID, context)
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getAttachments();
      })
      .catch();
  }

  const getAttachments = () => {

    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    if (caseID && caseID !== "") {
      const attPromise = attachmentUtils.getCaseAttachments(caseID, thePConn.getContextName());

      attPromise
        .then( (resp) => {
          const arFullListAttachments = addAttachments(resp);
          const attachmentsCount = arFullListAttachments.length;
          const arItems: any = arFullListAttachments.slice(0, 3).map((att) => {
            return getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => downloadAttachedFile(att) : null,
              cancelFile: null,
              deleteFile: !att.progress ? () => deleteAttachedFile(att) : null,
              removeFile: null
            });
          });

          setList((current) => {
            return {...current, count: attachmentsCount, data: arItems}
          });
        });
    }
  }

  function setNewFiles(arFiles) {
    let index = 0;
    for (const file of arFiles) {
      if (!validateMaxSize(file, 5)) {
        file.error = true;
        file.meta = "File is too big. Max allowed size is 5MB.";
      }
      file.mimeType = file.type;
      file.icon = Utils.getIconFromFileType(file.type);
      file.ID = `${new Date().getTime()}I${index}`;
      index+=1;
    }
    return arFiles;
  }

  function getFiles(arFiles: Array<any>): Array<any> {
    return setNewFiles(arFiles);
  }

  function uploadMyFiles(event) {
    // alert($event.target.files[0]); // outputs the first file
    const arFiles: any = getFiles(event.target.files);
    // convert FileList to an array
    const myFiles = Array.from(arFiles);

    const arFileList$: any = myFiles.map((att: any) => {
      return getListUtilityItemProps({
        att,
        downloadFile: !att.progress ? () => downloadAttachedFile(att) : null,
        cancelFile: null,
        deleteFile: !att.progress ? () => deleteAttachedFile(att) : null,
        removeFile: null
      });
    });
    setFileData((current) => {
      return {...current, fileList: arFileList$, attachedFiles: arFiles}
    });
  }

  useEffect(() => {
    getAttachments();
  }, [""]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function onAddFilesClick() {
    setFileData((current) => {
      return {...current, showfileModal: true}
    });
    setAnchorEl(null);
  }

  function removeFileFromList(item: any) {
    const arFileList: any = fileData.attachedFiles;
    if (item !== null) {
      for (const fileIndex in arFileList) {
        if (arFileList[fileIndex].id === item.id) {
          arFileList.splice(parseInt(fileIndex, 10), 1);
        }
      }
      setFileData((current) => {
        return {...current, fileList: arFileList}
      });
    }
  }

  function closeFilePopup() {
    setFileData((current) => {
      return {...current, showfileModal: false}
    });
  }

  function onAttachFiles() {
    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const onUploadProgress = () => {};
    const errorHandler = () => {};
    closeFilePopup()
    for (const file of fileData.attachedFiles) {
      attachmentUtils
      .uploadAttachment(
        file,
        onUploadProgress,
        errorHandler,
        thePConn.getContextName()
      )
      .then((fileResponse) => {
        if (fileResponse.type === "File") {
          attachmentUtils.linkAttachmentsToCase(
            caseID,
            [ fileResponse ],
            "File",
            thePConn.getContextName()
          )
          .then(() => {
            setFileData((current) => {
              return {...current, fileList: [], attachedFiles: []};
            });
            getAttachments();
          })
          .catch();
        }
      })
      .catch();
    }
  }

  function onAddLinksClick() {
    setLinkData((current) => {
      return {...current, showLinkModal: true}
    });
    setAnchorEl(null);
  }

  function closeAddLinksPopup() {
    setLinkData((current) => {
      return {...current, showLinkModal: false}
    });
  }

  return (
    <div className="psdk-utility">
      <div className="psdk-header">
        <img className="psdk-file-utility-card-svg-icon" src={headerSvgIcon$}></img>
        <div className="header-text">{header}</div>
        <div className="psdk-utility-count">{list.count}</div>
        <div style={{flexGrow: 1}}></div>
        <div>
          <IconButton
            id="long-button"
            aria-controls={open ? 'simple-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
          <MoreVertIcon />
          </IconButton>
          <Menu style={{marginTop: '3rem'}}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem style={{fontSize: '14px'}} onClick={onAddFilesClick}>Add Files</MenuItem>
            <MenuItem style={{fontSize: '14px'}} onClick={onAddLinksClick}>Add Links</MenuItem>
          </Menu>
        </div>
      </div>
      {list.data.length > 0 && (<div style={{marginTop: '1rem'}}>
        <SummaryList arItems$={list.data}></SummaryList>
      </div>)}
      {fileData.showfileModal && (
        <div className="psdk-dialog-background">
        <div className="psdk-modal-file-top">
          <h3>Add local files</h3>
          <div className="psdk-modal-body">
            <div className="psdk-modal-file-selector">
              <label htmlFor='upload-photo'>
                <input style={{ display: 'none' }} id='upload-photo' name='upload-photo' type='file' multiple onChange={uploadMyFiles}/>
                <Button variant='outlined' color='primary' component="span">Upload file</Button>
              </label>
            </div>
            {fileData.fileList.length > 0 && (<div style={{marginTop: '1rem'}}>
              <SummaryList menuIconOverride$='trash' arItems$={fileData.fileList} menuIconOverrideAction$={removeFileFromList}></SummaryList>
            </div>)}
            {fileData.fileList.length === 0 && (<div></div>)}
            <ActionButtons arMainButtons={fileData.fileMainButtons} arSecondaryButtons={fileData.fileSecondaryButtons}
             primaryAction={onAttachFiles} secondaryAction={closeFilePopup}></ActionButtons>
          </div>
        </div>
      </div>
      )}
      {linkData.showLinkModal && (
        <div className="psdk-dialog-background">
          <div className="psdk-modal-file-top">
            <h3>Add local files</h3>
            <div className="psdk-modal-body">
              <div className="psdk-modal-links-row">
                  <div className="psdk-links-two-column">
                    <div className="psdk-modal-link-data">
                      <TextField fullWidth variant="outlined" label="Link title" size="small" required={required}/>
                    </div>
                    <div className="psdk-modal-link-data">
                      <TextField fullWidth variant="outlined" label="URL" size="small" required={required}/>
                    </div>
                  </div>
                  <div className="psdk-modal-link-add">
                    <Button className="psdk-add-link-action" component="span">Add Link</Button>
                  </div>
                </div>
                <ActionButtons arMainButtons={linkData.linkMainButtons} arSecondaryButtons={linkData.linkSecondaryButtons}
                secondaryAction={closeAddLinksPopup}></ActionButtons>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
