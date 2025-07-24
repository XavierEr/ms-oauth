interface DgpSystemsResponse {
  httpStatus: number;
  message: string;
  Records: DgpSystemsResponseRecords;
}

interface DgpSystemsResponseRecords {
  Count: string;
  MetaData: DgpSystemsResponseRecordsMetaData;
  LevelCounts: {
    LevelCount: Array<DgpSystemsResponseRecordsLevelCount>;
  };
  Record: Array<DgpSystemsResponseRecordsRecord>;
}

interface DgpSystemsResponseRecordsMetaData {
  FieldDefinitions: {
    FieldDefinition: Array<DgpSystemsResponseRecordsMetaDataFieldDefinition>;
  }
}

interface DgpSystemsResponseRecordsMetaDataFieldDefinition {
  '@id': string;
  '@guid': string;
  '@name': string;
  '@alias': string;
}

interface DgpSystemsResponseRecordsLevelCount {
  '@id': string;
  '@guid': string;
  '@count': string;
}

interface Record {
  '@contentId': string;
  '@levelId': string;
  '@levelGuid': string;
  '@moduleId': string;
  '@parentId': string;
  Field: Array<{
    '@id': string;
    '@guid': string;
    '@type': string;
    '#text': string | undefined;
    ListValues: {
      ListValue: {
        '@id': string;
        '@displayName': string;
        '#text': string;
      }
    } | undefined;
  }>;
}

interface DgpSystemsResponseRecordsRecord extends Record {
  Record: Array<Record> | Record;
};