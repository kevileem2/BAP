// tslint:disable: max-classes-per-file
import Realm, { Results } from 'realm'

export class Clients {
  public static schema: Realm.ObjectSchema = {
    name: 'Clients',
    primaryKey: 'guid',
    properties: {
      id: 'int?',
      parentRecordGuid: 'string?',
      guid: 'string',
      changeType: 'int?',
      name: 'string?',
      lastName: 'string?',
      age: 'int?',
      description: 'string?',
      room: 'int?',
    },
  }
  public guid: string
  public id: number | null
  public parentRecordGuid: string | null
  public changeType: number | null
  public name: string | null
  public lastName: string | null
  public age: number | null
  public description: string | null
  public room: number | null
}

export class Notes {
  public static schema: Realm.ObjectSchema = {
    name: 'Notes',
    primaryKey: 'guid',
    properties: {
      id: 'int?',
      guid: 'string',
      changeType: 'int?',
      message: 'string?',
      parentGuid: 'string?',
      createdAt: 'date?',
      updatedAt: 'date?',
    },
  }
  public guid: string
  public id: number | null
  public changeType: number | null
  public message: string | null
  public parentGuid: string | null
  public createdAt: Date | null
  public updatedAt: Date | null
}

export class User {
  public static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      email: 'string?',
      firstName: 'string?',
      lastName: 'string?',
    },
  }

  public guid: string
  public email: string | null
  public firstName: string | null
  public lastName: string | null
}

export class UserSession {
  public static schema: Realm.ObjectSchema = {
    name: 'UserSession',
    primaryKey: 'type',
    properties: {
      type: 'string',
      email: 'string?',
      fullName: 'string?',
      message: 'string?',
      language: 'string?',
      loading: 'bool',
      tokenCheck: 'bool',
    },
  }

  public type: string
  public email: string | null
  public fullName: string | null
  public message: string | null
  public language: string | null
  public loading: boolean
  public tokenCheck: boolean | null
}

const config = {
  schema: [Clients, UserSession, Notes, User],
  schemaVersion: 0,
  migration: (oldRealm: Realm, newRealm: Realm) => {},
}

const performMigrations = () => {
  const schemas = [config]
  let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath)

  if (nextSchemaIndex !== -1 && nextSchemaIndex !== schemas.length - 1) {
    while (nextSchemaIndex < schemas.length) {
      const migratedRealm = new Realm(schemas[nextSchemaIndex])
      migratedRealm.close()
      nextSchemaIndex += 1
    }
  }
}

const writeTransaction = async (
  writeAction: (realm: Realm) => void,
  realm?: Realm
) => {
  if (realm) {
    try {
      realm.write(() => {
        writeAction(realm)
      })
    } catch (err) {
      console.log('Realm Error: ', err)
    }
  } else {
    await Realm.open(config).then((realmInstance) => {
      try {
        realmInstance.write(() => {
          writeAction(realmInstance)
        })
      } catch (err) {
        console.log('Realm Error: ', err)
      }
    })
  }
}

export default {
  writeTransaction,
  config,
  performMigrations,
}
