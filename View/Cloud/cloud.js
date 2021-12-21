export class Cloud {
    constructor() {
        CloudKit.configure({
            locale: 'en-us',

            containers: [{

                // Change this to a container identifier you own.
                containerIdentifier: 'iCloud.com.devetech.CoreDataTest',

                apiTokenAuth: {
                    // And generate a web token through CloudKit Dashboard.
                    apiToken: '7769de88bed3a3c93ceea9b62c1890ab61bd441854e0396ef2ff5ca049ad9ccc',

                    persist: true, // Sets a cookie.

                    signInButton: {
                        id: 'apple-sign-in-button',
                        theme: 'black' // Other options: 'white', 'white-with-outline'.
                    },

                    signOutButton: {
                        id: 'apple-sign-out-button',
                        theme: 'black'
                    }
                },

                environment: 'development'
            }]
        });
        this.container = CloudKit.getDefaultContainer();
        this.privateDB = this.container.privateCloudDatabase
        this.sharedDB = this.container.sharedCloudDatabase
    }
    gotoAuthenticatedState(userIdentity) {
        console.log("gotoAuthenticatedState")
        document.getElementById("root").style.filter = 'blur(0)'
        document.getElementById("login").style.display = 'none'
        document.getElementById('apple-sign-in-button').style.display = 'none'
        // document.getElementById('apple-sign-out-button').style.display = 'inline'
       console.log(document.querySelector('#dialog'))
        // document.getElementById("login").style.display = 'none'
        let name = userIdentity.nameComponents;
        if(name) {
            console.log(name.givenName+' '+name.familyName)
        } else {
            console.log('User record name: ' + userIdentity.userRecordName)
        }
        this.container
            .whenUserSignsOut()
            .then(this.gotoUnauthenticatedState);
    }
    gotoUnauthenticatedState(error) {
        console.log("gotoUnauthenticatedState"+error)
        document.getElementById("root").style.filter = 'blur(1.5rem)'
        document.getElementById("login").style.display = 'block'
        document.getElementById('apple-sign-in-button').style.display = 'inline'
        // document.getElementById('apple-sign-out-button').style.display = 'none'
        console.log(document.querySelector('#dialog'))

        if(error && error.ckErrorCode === 'AUTH_PERSIST_ERROR') {
            showDialogForPersistError();
        }

        // displayUserName('Unauthenticated (Please Login First)');
        this.container
            .whenUserSignsIn()
            .then(this.gotoAuthenticatedState)
            .catch(this.gotoUnauthenticatedState);
    }
    SetUpAuth() {

        // Check a user is signed in and render the appropriate button.
        let _this = this
        this.container.setUpAuth()
            .then(function(userIdentity) {

                // Either a sign-in or a sign-out button was added to the DOM.

                // userIdentity is the signed-in user or null.
                if(userIdentity) {
                    _this.gotoAuthenticatedState(userIdentity)
                } else {
                    _this.gotoUnauthenticatedState();

                }
            });
        return this
    }
    Download() {
        this.FetchCurrentUserIdentify()

        let p0 = this.FetchDatabaseChanges(this.privateDB, null)
        let p1 = this.FetchDatabaseChanges(this.sharedDB, null)
        Promise.all([p0, p1]).then( result => {
            let records = result.flat()
            console.log(records)
            let content = document.getElementById("content")
            content.DisplayValue(records)
        })
    }
    DownloadHistory() {
        let p0 = this.PerformQuery(
            '_defaultZone',
            'History_Root'
        )
        let p1 = this.PerformQuery(
            '_defaultZone',
            'History'
        )

        Promise.all([p0, p1]).then((result) => {
            console.log(result)
        })
    }
    FetchCurrentUserIdentify() {
        this.container.fetchCurrentUserIdentity().then((userIdentity) => {
            console.log('user identify', userIdentity)
            window.localStorage.setItem('userIdentity', JSON.stringify(userIdentity))
        })
    }
    FetchDatabaseChanges(database, syncToken) {
        let opts = {}
        if (syncToken) {
            opts.syncToken = syncToken
        }
        let _this = this
        return new Promise((resolve, reject) => {
            database.fetchDatabaseChanges(opts).then((response) => {
                let promiseArr = []
                if (response.hasErrors) {
                    console.log(response.errors)
                } else {
                    let newSyncToken = response.syncToken
                    let zones = response.zones.filter((element) => {
                        if (element.deleted) {
                            return false
                        }
                        return true
                    })
                    let moreComing = response.moreComing

                    // console.log(zones)

                    for (const zone of zones) {
                        let promise = _this.FetchRecordZoneChanges(database, zone, null).then((r0) => {
                            return {
                                zone: zone,
                                records: r0
                            }
                        })
                        promiseArr.push(promise)
                    }
                }
                Promise.all(promiseArr).then( result => {
                    // console.log(result)
                    resolve(result)
                })
            })
        })
    }
    FetchRecordZoneChanges(database, zone, syncToken) {
        let args = {zoneID: zone.zoneID}
        if (syncToken) {
            args.syncToken = syncToken
        }
        return new Promise((resolve, reject) => {
            database.fetchRecordZoneChanges(args).then((response) => {
                if (response.hasErrors) {
                    console.log(response.errors)
                    reject(response.errors[0])
                } else {
                    let records = response.zones[0].records
                    resolve(records)
                }
            })
        })
    }
    SaveRecords(
        database, recordName,recordChangeTag,recordType,zoneName,
        forRecordName,forRecordChangeTag,publicPermission,ownerRecordName,
        participants,parentRecordName,fields,createShortGUID
    ) {

        let options = {
            // By passing and fetching number fields as strings we can use large
            // numbers (up to the server's limits).
            numbersAsStrings: true

        };

        // If no zoneName is provided the record will be saved to the default zone.
        if(zoneName) {
            options.zoneID = { zoneName: zoneName }
            if(ownerRecordName) {
                options.zoneID.ownerRecordName = ownerRecordName
            }
        }

        let record = {

            recordType: recordType

        }

        // If no recordName is supplied the server will generate one.
        if(recordName) {
            record.recordName = recordName
        }

        // To modify an existing record, supply a recordChangeTag.
        if(recordChangeTag) {
            record.recordChangeTag = recordChangeTag
        }

        // Convert the fields to the appropriate format.
        record.fields = Object.keys(fields).reduce(function(obj,key) {
            obj[key] = { value: fields[key] }
            return obj
        },{})


        // If we are going to want to share the record we need to
        // request a stable short GUID.
        if(createShortGUID) {
            record.createShortGUID = true
        }

        // If we want to share the record via a parent reference we need to set
        // the record's parent property.
        if(parentRecordName) {
            record.parent = { recordName: parentRecordName }
        }

        if(publicPermission) {
            record.publicPermission = CloudKit.ShareParticipantPermission[publicPermission]
        }

        // If we are creating a share record, we must specify the
        // record which we are sharing.
        if(forRecordName && forRecordChangeTag) {
            record.forRecord = {
                recordName: forRecordName,
                recordChangeTag: forRecordChangeTag
            }
        }

        if(participants) {
            record.participants = participants.map(function(participant) {
                return {
                    userIdentity: {
                        lookupInfo: { emailAddress: participant.emailAddress }
                    },
                    permission: CloudKit.ShareParticipantPermission[participant.permission],
                    type: participant.type,
                    acceptanceStatus: participant.acceptanceStatus
                }
            })
        }

        return database.saveRecords(record,options)
            .then(function(response) {
                console.log(response)
                if (response.hasErrors) {
                    throw response.errors[0]
                } else {
                    return response.records[0]
                }

            })
    }
    DeleteRecord(database, recordName, zoneName, ownerRecordName) {
        let zoneID, options;

        if(zoneName) {
            zoneID = { zoneName: zoneName };
            if(ownerRecordName) {
                zoneID.ownerRecordName = ownerRecordName;
            }
            options = { zoneID: zoneID };
        }

        return database.deleteRecords(recordName,options)
            .then(function(response) {
                if (response.hasErrors) {
                    throw response.errors[0]
                } else {
                    return response.records[0]
                }
        })
    }
    DeleteRecordZone(zoneName) {
        return this.privateDB.deleteRecordZones({zoneName: zoneName}).then((response) => {
            if (response.hasErrors){
                throw response.errors[0]
            } else {
                console.log(response)
                return response.zones[0]
            }
        })
    }
    SaveRecordZones(name, content) {
        const zoneName = `${name}~!~${new Date().getTime()}`
        const fields = {
            "content": content
        }
        return this.privateDB.saveRecordZones({zoneName: zoneName}).then((response) => {
            if (response.hasErrors) {
                throw response.errors[0]
            } else {
                const zone = response.zones[0]
                return this.SaveRecords(
                    this.privateDB,
                    name,
                    null,
                    'Group_Version_2',
                    zone.zoneID.zoneName,
                    null,
                    null,
                    null,
                    zone.zoneID.ownerRecordName,
                    null,
                    null,
                    fields,
                    null
                ).then((root) => {
                    return {
                        zone: zone,
                        records: [root]
                    }
                })
            }
        })
    }
    Rename(zone, record, content) {
        const userIdentity = JSON.parse(window.localStorage.getItem('userIdentity'))
        const database = zone.zoneID.ownerRecordName === userIdentity.userRecordName ? this.privateDB : this.sharedDB
        const fields = {
            "content": content
        }
        return this.SaveRecords(
            database,
            record.recordName,
            record.recordChangeTag,
            record.recordType,
            zone.zoneID.zoneName,
            null,
            null,
            null,
            zone.zoneID.ownerRecordName,
            null,
            null,
            fields,
            null
        ).then((root) => {
            return root
        })
    }
    PerformQuery(zoneName,recordType) {
        const query = {
            recordType: recordType
        }


        const options = {
            zoneID: {
                zoneName: zoneName
            }
        }


        return this.privateDB.performQuery(query, options).then((response) => {
            if (response.hasErrors) {
                throw  response.errors[0]
            } else {
                const records = response.records
                return records
            }
        })
    }
    ShareWithUI(recordName, zoneName, ownerRecordName, shareTitle, supportedAccess, supportedPermissions) {
        const zoneID = {
            zoneName: zoneName
        }
        if (ownerRecordName) {
            zoneID.ownerRecordName = ownerRecordName
        }
        return this.privateDB.shareWithUI({
            record: {
                recordName: recordName
            },
            zoneID: zoneID,
            shareTitle: shareTitle,
            supportedAccess: supportedAccess,
            supportedPermissions: supportedPermissions
        }).then((response) => {
            console.log(response)
            if (response.hasErrors) {
                throw response.errors[0]
            } else {
                return response
            }
        })
    }
}