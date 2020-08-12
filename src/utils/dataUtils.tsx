import { useContext } from 'react'
import Realm, { Results } from 'realm'
import { RealmContext } from '../App'
import storage, { Clients, Notes } from './storage'
import { format } from 'date-fns'

const remapNewClientsItems = (data: Results<Clients>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: Clients) => {
    result = [
      ...result,
      {
        guid: element.guid,
        parentRecordGuid: element.parentRecordGuid,
        firstName: element.name,
        lastName: element.lastName,
        description: element.description,
        age: element.age,
        room: element.room,
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapUpdatedClientsItems = (data: Results<Clients>) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: Clients) => {
    result = [
      ...result,
      {
        id: element.id,
        firstName: element.name,
        lastName: element.lastName,
        description: element.description,
        age: element.age,
        room: element.room,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapDeletedClientsItems = (data: Results<Clients>) => {
  let result = []
  data.filtered('changeType = 0').forEach((element: Clients) => {
    result = [
      ...result,
      {
        id: element.id,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapUpdatedNotesItems = (data: Results<Notes>) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: Notes) => {
    result = [
      ...result,
      {
        id: element.id,
        parentGuid: element.parentGuid,
        message: element.message,
        created_at:
          element.createdAt &&
          format(element.createdAt, "yyyy-MM-dd'T'HH:mm:ss"),
        updated_at:
          element.updatedAt &&
          format(element.updatedAt, "yyyy-MM-dd'T'HH:mm:ss"),
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapNewNotesItems = (data: Results<Notes>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: Notes) => {
    result = [
      ...result,
      {
        guid: element.guid,
        parentGuid: element.parentGuid,
        message: element.message,
        created_at:
          element.createdAt &&
          format(element.createdAt, "yyyy-MM-dd'T'HH:mm:ss"),
        updated_at:
          element.updatedAt &&
          format(element.updatedAt, "yyyy-MM-dd'T'HH:mm:ss"),
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapDeletedNotesItems = (data: Results<Notes>) => {
  let result = []
  data.filtered('changeType = 0').forEach((element: Notes) => {
    result = [
      ...result,
      {
        id: element.id,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

export const getUpdatePackage = async () => {
  const updatePackage = {
    clients: [],
    notes: [],
  }
  await Realm.open(storage.config).then((realmInstance: Realm) => {
    const ClientItems = realmInstance.objects<Clients>('Clients')
    const NoteItems = realmInstance.objects<Notes>('Notes')
    updatePackage.clients = [
      ...remapNewClientsItems(ClientItems),
      ...remapUpdatedClientsItems(ClientItems),
      ...remapDeletedClientsItems(ClientItems),
    ]
    updatePackage.notes = [
      ...remapNewNotesItems(NoteItems),
      ...remapUpdatedNotesItems(NoteItems),
      ...remapDeletedNotesItems(NoteItems),
    ]
  })
  return updatePackage
}

export const clearRealmStorage = async (realm: Realm) => {
  await storage.writeTransaction((realmInstance) => {
    const deletableClasses = ['Clients', 'Notes']
    deletableClasses.forEach((item) => {
      realmInstance.delete(realmInstance.objects(item))
    })
  }, realm)
}

export const applyPackageToStorage = async (object) => {
  await storage.writeTransaction((realmInstance) => {
    object.clients?.forEach((element) => {
      realmInstance.create(
        'Clients',
        {
          guid: element.guid,
          id: element.id,
          parentRecordGuid: element.parentRecordGuid,
          name: element.firstName,
          lastName: element.lastName,
          room: element.room.length ? parseInt(element.room) : null,
          age: element.age ? parseInt(element.age) : null,
          description: element.condition,
        },
        Realm.UpdateMode.All
      )
    })
    object.notes?.forEach((element) => {
      realmInstance.create(
        'Notes',
        {
          guid: element.guid,
          id: element.id,
          message: element.message,
          parentGuid: element.parentGuid,
          createdAt: element.created_at && new Date(element.created_at),
          updatedAt: element.updated_at && new Date(element.updated_at),
        },
        Realm.UpdateMode.All
      )
    })
  })
}
