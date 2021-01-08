// tslint:disable: max-classes-per-file
import Realm from 'realm'

export class Clients {
  public static schema: Realm.ObjectSchema = {
    name: 'Clients',
    primaryKey: 'guid',
    properties: {
      id: 'int?',
      guid: 'string',
      changeType: 'int?',
      name: 'string?',
      lastName: 'string?',
    },
  }
  public guid: string
  public id: number | null
  public changeType: number | null
  public name: string | null
  public lastName: string | null
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
      activityGuid: 'string?',
      createdAt: 'date?',
      updatedAt: 'date?',
    },
  }
  public guid: string
  public id: number | null
  public changeType: number | null
  public message: string | null
  public parentGuid: string | null
  public activityGuid: string | null
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

export class Tasks {
  public static schema: Realm.ObjectSchema = {
    name: 'Tasks',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      id: 'int?',
      title: 'string?',
      description: 'string?',
      completed: 'bool?',
      createdAt: 'date?',
      updatedAt: 'date?',
      completedAt: 'date?',
      dueTime: 'date?',
      changeType: 'int?'
    }
  }

  public guid: string
  public id: number
  public title: string | null
  public description: string | null
  public completed: boolean | null
  public createdAt: Date | null
  public updatedAt: Date | null
  public completedAt: Date | null
  public dueTime: Date | null
  public changeType: number | null
}

export class Memories {
  public static schema: Realm.ObjectSchema = {
    name: 'Memories',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      id: 'int?',
      title: 'string?',
      description: 'string?',
      changeType: 'int?'
    }
  }

  public guid: string
  public id: number | null
  public title: string | null
  public description: string | null
  public changeType: number | null
}

export class IntakeForms {
  public static schema: Realm.ObjectSchema = {
    name: 'IntakeForms',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      id: 'int?',
      title: 'string?',
      changeType: 'int?'
    }
  }

  public guid: string
  public id: number | null
  public title: string | null
  public changeType: number | null
}
export class IntakeFormQuestions {
  public static schema: Realm.ObjectSchema = {
    name: 'IntakeFormQuestions',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      id: 'int?',
      parentRecordGuid: 'string',
      question: 'string?',
      sort: 'int?',
      changeType: 'int?'
    }
  }

  public guid: string
  public id: number | null
  public parentRecordguid: string
  public question: string | null
  public sort: number | null
  public changeType: number | null
}
export class ClientIntakeFormQuestions {
  public static schema: Realm.ObjectSchema = {
    name: 'ClientIntakeFormQuestions',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      id: 'int?',
      parentRecordGuid: 'string',
      parentIntakeFormGuid: 'string',
      question: 'string?',
      answer: "string?",
      sort: "int?",
      changeType: 'int?'
    }
  }

  public guid: string
  public id: number | null
  public parentRecordguid: string
  public parentIntakeFormGuid: string
  public question: string | null
  public answer: string | null
  public sort: number | null
  public changeType: number | null
}

export class Activity {
  public static schema: Realm.ObjectSchema = {
    name: 'Activity',
    primaryKey: 'guid',
    properties: {
      guid: 'string',
      id: 'int?',
      activity: 'string?',
      changeType: 'int?'
    }
  }

  public guid: string
  public id: number | null
  public activity: string | null
  public changeType: number | null
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
  schema: [
    Clients,
    UserSession,
    Notes,
    User,
    Tasks,
    Memories,
    IntakeForms,
    IntakeFormQuestions,
    ClientIntakeFormQuestions,
    Activity
  ],
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
