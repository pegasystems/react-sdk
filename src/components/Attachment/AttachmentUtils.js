import download from 'downloadjs';

export const validateMaxSize = (fileObj, maxSizeInMB) => {
  const fileSize = (fileObj.size / 1048576).toFixed(2);
  return parseFloat(fileSize) < parseFloat(maxSizeInMB);
};

export const fileDownload = (data, fileName, ext) => {
  const name = ext ? `${fileName}.${ext}` : fileName;
  // Temp fix: downloading EMAIl type attachment as html file
  if (ext === 'html') {
    download(data, name, 'text/html');
  } else {
    download(atob(data), name);
  }
};

export const getIconFromFileType = (fileType) => {
  let icon = 'document-doc';
  if (!fileType) return icon;
  if (fileType.startsWith('audio')) {
    icon = 'audio';
  } else if (fileType.startsWith('video')) {
    icon = 'video';
  } else if (fileType.startsWith('image')) {
    icon = 'picture';
  } else if (fileType.includes('pdf')) {
    icon = 'document-pdf';
  } else {
    const [, subtype] = fileType.split('/');
    const foundMatch = (sources) => {
      return sources.some((key) => subtype.includes(key));
    };

    if (foundMatch(['excel', 'spreadsheet'])) {
      icon = 'document-xls';
    } else if (foundMatch(['zip', 'compressed', 'gzip', 'rar', 'tar'])) {
      icon = 'document-compress';
    }
  }

  return icon;
};

export const getIconForAttachment = (attachment) => {
  let icon;
  switch (attachment.type) {
    case "FILE":
      icon = this.getIconFromFileType(attachment.mimeType);
      break;
    case "URL":
      icon = "chain";
      break;
    default:
      icon = "document-doc";
  }
  return icon;
};

export const buildFilePropsFromResponse = (respObj) => {
  return {
    props: {
      meta: `${respObj.pyCategoryName}, ${respObj.pxCreateOperator}`,
      name: respObj.pyAttachName,
      icon: getIconFromFileType(respObj.pyMimeFileExtension)
    },
    responseProps: {
      ...respObj
    }
  };
};
