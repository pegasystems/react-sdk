import React, { useEffect, useState } from "react";
import TextField from '@material-ui/core/TextField';
import { Utils } from "../../../helpers/utils";
import download from "downloadjs";
import SummaryList from '../../widgets/SummaryList';
import ActionButtons from '../ActionButtons';
import './FileUtility.css';
import  { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import { validateMaxSize } from '../../Attachment/AttachmentUtils';
import { CircularProgress } from "@material-ui/core";

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
  const closeSvgIcon = Utils.getImageSrc("times", PCore.getAssetLoader().getStaticServerUrl());
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
  const [link, setLink] = useState({title: '', url: '', disable: true});
  const [inProgress, setProgress] = useState(false);
  const [showViewAllModal, setViewAll] = useState(false);
  const [vaItems, setFullAttachments] = useState([]);

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
          const viewAllarItems: any = arFullListAttachments.map((att) => {
            return getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => downloadAttachedFile(att) : null,
              cancelFile: null,
              deleteFile: !att.progress ? () => deleteAttachedFile(att) : null,
              removeFile: null
            });
          });
          setProgress(false);
          setList((current) => {
            return {...current, count: attachmentsCount, data: arItems}
          });
          setFullAttachments(viewAllarItems);
        });
    }
  }

  useEffect(() => {
    getAttachments();
  }, []);


  useEffect(() => {
    PCore.getPubSubUtils().subscribe(
      PCore.getEvents().getCaseEvent().CASE_ATTACHMENTS_UPDATED_FROM_CASEVIEW,
      getAttachments,
      "caseAttachmentsUpdateFromCaseview"
    );

    return () => {
      PCore.getPubSubUtils().unsubscribe(
        PCore.getEvents().getCaseEvent().CASE_ATTACHMENTS_UPDATED_FROM_CASEVIEW,
        "caseAttachmentsUpdateFromCaseview"
      );
    };
  }, []);

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
    const arFiles = getFiles(event.target.files);
    // convert FileList to an array
    const myFiles: any = Array.from(arFiles);

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
      return {...current, fileList: arFileList$, attachedFiles: myFiles}
    });
  }



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
    let attachedFiles: any = fileData.attachedFiles;
    let fileList: any = fileData.fileList;
    if (item !== null) {
      attachedFiles = attachedFiles.filter(ele => ele.ID !== item.id);
      fileList = fileList.filter(ele => ele.id !== item.id);
      setFileData((current) => {
        return {...current, fileList, attachedFiles}
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
    if (fileData.attachedFiles && fileData.attachedFiles.length > 0 ) {
      setProgress(true);
    }
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

  const fieldlinkOnChange = (event) => {
    const title = event.target.value;
    setLink((current) => {
      const updatedData = {...current, title};
      updatedData.disable = !(updatedData.title && updatedData.url);
      return updatedData;
    });
  }

  function fieldurlOnChange(event) {
    const url = event.target.value;
    setLink((current) => {
      const updatedData = {...current, url}
      updatedData.disable = !(updatedData.title && updatedData.url);
      return updatedData;
    });
  }

  function addLink() {
    // copy list locally
    const localList: any = linkData.linksList.slice();
    const url = link.url;
    if (!/^(http|https):\/\//.test(link.url)) {
      link.url  = `http://${link.url}`;
    }

    // list for display
    let oLink: any = {};
    oLink.icon = "chain";
    oLink.ID = `${new Date().getTime()}`;
    oLink = getListUtilityItemProps({
      att: oLink,
      downloadFile: null,
      cancelFile: null,
      deleteFile: null,
      removeFile: null
    });
    oLink.type = "URL";
    oLink.primary.type = oLink.type;
    oLink.visual.icon = "chain";
    oLink.primary.name = link.title;
    oLink.primary.icon = "open";
    oLink.secondary.text = url;

    localList.push(oLink);

    // list for actually attachments
    const attachedListTemp: any = linkData.attachedLinks.slice();
    const attachedLink: any = {};
    attachedLink.id = oLink.id;
    attachedLink.linkTitle = link.title;
    attachedLink.type = oLink.type;
    attachedLink.url = url;

    attachedListTemp.push(attachedLink);
    setLinkData((current) => {
      return {...current, linksList: localList, attachedLinks: attachedListTemp}
    });
    // clear values
    setLink({title: '', url: '', disable: true});
  }

  function removeLinksFromList(item: any) {
    let attachedLinks: any = linkData.attachedLinks;
    let linksList: any = linkData.linksList;
    if (item !== null) {
      attachedLinks = attachedLinks.filter(ele => ele.id !== item.id);
      linksList = linksList.filter(ele => ele.id !== item.id);
      setLinkData((current) => {
        return {...current, linksList, attachedLinks}
      });
    }
  }

  function onAttachLinks() {
    const attachmentUtils = PCore.getAttachmentUtils();
    const caseID = thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const links = linkData.attachedLinks;
    closeAddLinksPopup();
    const linksToAttach = links.map((item: any) => ({
      type: "URL",
      category: "URL",
      url: item.url,
      name: item.linkTitle
    }));

    if (linksToAttach && linksToAttach.length > 0) {
      setProgress(true);
      attachmentUtils
      .linkAttachmentsToCase(caseID, linksToAttach, "URL", thePConn.getContextName())
      .then( () => {
        setLinkData((current) => {
          return {...current, linksList: [], attachedLinks: []};
        });
        getAttachments();
      })
      .catch(setProgress(false));
    }
  }

  return (
    <div className="psdk-utility">
      {inProgress && (<div className="progress-div"><CircularProgress /></div>)}
      <div className="psdk-header">
        <img className="psdk-file-utility-card-svg-icon" src={headerSvgIcon$}></img>
        <div className="header-text">{header}</div>
        <div className="psdk-utility-count" id="attachments-count">{list.count}</div>
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
      {list.count > 3 && (<div className="psdk-utility-view-all">
        <Button style={{textTransform: 'none'}} color="primary" onClick = {() => setViewAll(true)}>View all</Button>
      </div>)}
      {fileData.showfileModal && (
        <div className="psdk-dialog-background">
        <div className="psdk-modal-file-top">
          <h3>Add local files</h3>
          <div className="psdk-modal-body">
            <div className="psdk-modal-file-selector">
              <label htmlFor='upload-files'>
                <input style={{ display: 'none' }} id='upload-files' name='upload-files' type='file' multiple onChange={uploadMyFiles}/>
                <Button variant='outlined' color='primary' component="span">Upload file(s)</Button>
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
            <h3>Add links</h3>
            <div className="psdk-modal-body">
              <div className="psdk-modal-links-row">
                  <div className="psdk-links-two-column">
                    <div className="psdk-modal-link-data">
                      <TextField fullWidth variant="outlined" label="Link title" size="small" required={required} value={link.title} onChange={fieldlinkOnChange}/>
                    </div>
                    <div className="psdk-modal-link-data">
                      <TextField fullWidth variant="outlined" label="URL" size="small" required={required} value={link.url} onChange={fieldurlOnChange}/>
                    </div>
                  </div>
                  <div className="psdk-modal-link-add">
                    <Button className="psdk-add-link-action" color="primary" variant="contained" component="span" onClick={addLink} disabled={link.disable}>Add Link</Button>
                  </div>
                </div>
                {linkData.linksList.length > 0 && (<div style={{marginTop: '1rem'}}>
                  <SummaryList menuIconOverride$='trash' arItems$={linkData.linksList} menuIconOverrideAction$={removeLinksFromList}></SummaryList>
                </div>)}
                <ActionButtons arMainButtons={linkData.linkMainButtons} arSecondaryButtons={linkData.linkSecondaryButtons}
                primaryAction={onAttachLinks} secondaryAction={closeAddLinksPopup}></ActionButtons>
            </div>
          </div>
        </div>
      )}
      {showViewAllModal && (<div className="psdk-dialog-background">
        <div className="psdk-modal-file-top">
          <div className="psdk-view-all-header">
              <h3>Attachments</h3>
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button type="button" className="psdk-close-button" onClick = {() => setViewAll(false)}><img className="psdk-utility-card-actions-svg-icon" src={closeSvgIcon}></img></button>
          </div>
          <div className="psdk-view-all-body"><SummaryList arItems$={vaItems}></SummaryList></div>
        </div>
      </div>)}
    </div>

  )
}
