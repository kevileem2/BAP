import Realm, { Results } from 'realm'
import storage, {
  Activity,
  ClientIntakeFormQuestions,
  Clients,
  IntakeFormQuestions,
  IntakeForms,
  Memories,
  Notes,
  Tasks,
} from './storage'
import { format } from 'date-fns'

const remapNewClientsItems = (data: Results<Clients>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: Clients) => {
    result = [
      ...result,
      {
        guid: element.guid,
        firstName: element.name,
        lastName: element.lastName,
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
        activityGuid: element.activityGuid,
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
        activityGuid: element.activityGuid,
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

const remapNewActivityItems = (data: Results<Activity>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: Activity) => {
    result = [
      ...result,
      {
        guid: element.guid,
        activity: element.activity,
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapUpdatedActivityItems = (data: Results<Activity>) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: Activity) => {
    result = [
      ...result,
      {
        id: element.id,
        activity: element.activity,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapNewClientIntakeFormQuestionItems = (
  data: Results<ClientIntakeFormQuestions>
) => {
  let result = []
  data
    .filtered('changeType = 1')
    .forEach((element: ClientIntakeFormQuestions) => {
      result = [
        ...result,
        {
          guid: element.guid,
          parentRecordGuid: element.parentRecordGuid,
          parentIntakeFormGuid: element.parentIntakeFormGuid,
          question: element.question,
          answer: element.answer,
          sort: element.sort,
          changeType: element.changeType,
        },
      ]
    })
  return result
}
const remapUpdatedClientIntakeFormQuestionItems = (
  data: Results<ClientIntakeFormQuestions>
) => {
  let result = []
  data
    .filtered('changeType = 2')
    .forEach((element: ClientIntakeFormQuestions) => {
      result = [
        ...result,
        {
          id: element.id,
          parentRecordGuid: element.parentRecordGuid,
          parentIntakeFormGuid: element.parentIntakeFormGuid,
          question: element.question,
          answer: element.answer,
          sort: element.sort,
          changeType: element.changeType,
        },
      ]
    })
  return result
}

const remapNewIntakeFormQuestionItems = (
  data: Results<IntakeFormQuestions>
) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: IntakeFormQuestions) => {
    result = [
      ...result,
      {
        guid: element.guid,
        parentRecordGuid: element.parentRecordGuid,
        question: element.question,
        sort: element.sort,
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapUpdatedIntakeFormQuestionsItems = (
  data: Results<IntakeFormQuestions>
) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: IntakeFormQuestions) => {
    result = [
      ...result,
      {
        id: element.id,
        parentRecordGuid: element.parentRecordguid,
        question: element.question,
        sort: element.sort,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapNewIntakeFormItems = (data: Results<IntakeForms>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: IntakeForms) => {
    result = [
      ...result,
      {
        guid: element.guid,
        title: element.title,
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapUpdatedIntakeFormItems = (data: Results<IntakeForms>) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: IntakeForms) => {
    result = [
      ...result,
      {
        id: element.id,
        title: element.title,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapNewMemoryItems = (data: Results<Memories>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: Memories) => {
    result = [
      ...result,
      {
        guid: element.guid,
        title: element.title,
        description: element.description,
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapUpdatedMemoryItems = (data: Results<Memories>) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: Memories) => {
    result = [
      ...result,
      {
        id: element.id,
        title: element.title,
        description: element.description,
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapNewTaskItems = (data: Results<Tasks>) => {
  let result = []
  data.filtered('changeType = 1').forEach((element: Tasks) => {
    result = [
      ...result,
      {
        guid: element.guid,
        title: element.title,
        description: element.description,
        completed: element.completed,
        createdAt:
          element.createdAt &&
          format(element.createdAt, "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt:
          element.updatedAt &&
          format(element.updatedAt, "yyyy-MM-dd'T'HH:mm:ss"),
        completedAt:
          element.completedAt &&
          format(element.completedAt, "yyyy-MM-dd'T'HH:mm:ss"),
        dueTime:
          element.dueTime && format(element.dueTime, "yyyy-MM-dd'T'HH:mm:ss"),
        changeType: element.changeType,
      },
    ]
  })
  return result
}
const remapUpdatedTasksItems = (data: Results<Tasks>) => {
  let result = []
  data.filtered('changeType = 2').forEach((element: Tasks) => {
    result = [
      ...result,
      {
        id: element.id,
        title: element.title,
        description: element.description,
        completed: element.completed,
        createdAt:
          element.createdAt &&
          format(element.createdAt, "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt:
          element.updatedAt &&
          format(element.updatedAt, "yyyy-MM-dd'T'HH:mm:ss"),
        completedAt:
          element.completedAt &&
          format(element.completedAt, "yyyy-MM-dd'T'HH:mm:ss"),
        dueTime:
          element.dueTime && format(element.dueTime, "yyyy-MM-dd'T'HH:mm:ss"),
        changeType: element.changeType,
      },
    ]
  })
  return result
}

const remapDeletedItems = (
  data:
    | Results<Notes>
    | Results<Clients>
    | Results<Activity>
    | Results<ClientIntakeFormQuestions>
    | Results<IntakeFormQuestions>
    | Results<IntakeForms>
    | Results<Memories>
    | Results<Tasks>
) => {
  let result = []
  data
    .filtered('changeType = 0')
    .forEach(
      (
        element:
          | Notes
          | Clients
          | Activity
          | ClientIntakeFormQuestions
          | IntakeFormQuestions
          | IntakeForms
          | Memories
          | Tasks
      ) => {
        result = [
          ...result,
          {
            id: element.id,
            changeType: element.changeType,
          },
        ]
      }
    )
  return result
}

export const getUpdatePackage = async () => {
  const updatePackage = {
    clients: [],
    notes: [],
    activity: [],
    clientIntakeFormQuestions: [],
    intakeFormQuestions: [],
    intakeForms: [],
    memories: [],
    tasks: [],
  }
  await Realm.open(storage.config).then((realmInstance: Realm) => {
    const ClientItems = realmInstance.objects<Clients>('Clients')
    const NoteItems = realmInstance.objects<Notes>('Notes')
    const activityItems = realmInstance.objects<Activity>('Activity')
    const clientIntakeFormQuestionItems = realmInstance.objects<
      ClientIntakeFormQuestions
    >('ClientIntakeFormQuestions')
    const intakeFormQuestionItems = realmInstance.objects<IntakeFormQuestions>(
      'IntakeFormQuestions'
    )
    const intakeFormItems = realmInstance.objects<IntakeForms>('IntakeForms')
    const memoryItems = realmInstance.objects<Memories>('Memories')
    const taskItems = realmInstance.objects<Tasks>('Tasks')

    updatePackage.clients = [
      ...remapNewClientsItems(ClientItems),
      ...remapUpdatedClientsItems(ClientItems),
      ...remapDeletedItems(ClientItems),
    ]
    updatePackage.notes = [
      ...remapNewNotesItems(NoteItems),
      ...remapUpdatedNotesItems(NoteItems),
      ...remapDeletedItems(NoteItems),
    ]
    updatePackage.activity = [
      ...remapNewActivityItems(activityItems),
      ...remapUpdatedActivityItems(activityItems),
      ...remapDeletedItems(activityItems),
    ]
    updatePackage.clientIntakeFormQuestions = [
      ...remapNewClientIntakeFormQuestionItems(clientIntakeFormQuestionItems),
      ...remapUpdatedClientIntakeFormQuestionItems(
        clientIntakeFormQuestionItems
      ),
      ...remapDeletedItems(clientIntakeFormQuestionItems),
    ]
    updatePackage.intakeFormQuestions = [
      ...remapNewIntakeFormQuestionItems(intakeFormQuestionItems),
      ...remapUpdatedIntakeFormQuestionsItems(intakeFormQuestionItems),
      ...remapDeletedItems(intakeFormQuestionItems),
    ]
    updatePackage.intakeForms = [
      ...remapNewIntakeFormItems(intakeFormItems),
      ...remapUpdatedIntakeFormItems(intakeFormItems),
      ...remapDeletedItems(intakeFormItems),
    ]
    updatePackage.memories = [
      ...remapNewMemoryItems(memoryItems),
      ...remapUpdatedMemoryItems(memoryItems),
      ...remapDeletedItems(memoryItems),
    ]
    updatePackage.tasks = [
      ...remapNewTaskItems(taskItems),
      ...remapUpdatedTasksItems(taskItems),
      ...remapDeletedItems(taskItems),
    ]
  })
  return updatePackage
}

export const clearRealmStorage = async (realm: Realm) => {
  await storage.writeTransaction((realmInstance) => {
    const deletableClasses = [
      'Clients',
      'Notes',
      'Activity',
      'ClientIntakeFormQuestions',
      'IntakeFormQuestions',
      'IntakeForms',
      'Memories',
      'Tasks',
    ]
    deletableClasses.forEach((item) => {
      realmInstance.delete(realmInstance.objects(item))
    })
  }, realm)
}

export const applyPackageToStorage = async (object) => {
  try {
    await storage.writeTransaction((realmInstance) => {
      object.activities?.forEach((element) => {
        realmInstance.create(
          'Activity',
          {
            guid: element.guid,
            id: element.id,
            activity: element.activity,
          },
          Realm.UpdateMode.All
        )
      })
      object.clientIntakeFormQuestions?.forEach((element) => {
        realmInstance.create(
          'ClientIntakeFormQuestions',
          {
            guid: element.guid,
            id: element.id,
            parentRecordGuid: element.parentRecordGuid,
            parentIntakeFormGuid: element.parentIntakeFormGuid,
            question: element.question,
            answer: element.answer,
            sort: element.sort,
          },
          Realm.UpdateMode.All
        )
      })
      object.intakeFormQuestions?.forEach((element) => {
        realmInstance.create(
          'IntakeFormQuestions',
          {
            guid: element.guid,
            id: element.id,
            parentRecordGuid: element.parentRecordGuid,
            question: element.question,
            sort: element.sort,
          },
          Realm.UpdateMode.All
        )
      })
      object.intakeForms?.forEach((element) => {
        realmInstance.create(
          'IntakeForms',
          {
            guid: element.guid,
            id: element.id,
            title: element.title,
          },
          Realm.UpdateMode.All
        )
      })
      object.memories?.forEach((element) => {
        realmInstance.create(
          'Memories',
          {
            guid: element.guid,
            id: element.id,
            title: element.title,
            description: element.description,
          },
          Realm.UpdateMode.All
        )
      })
      object.tasks?.forEach((element) => {
        realmInstance.create(
          'Tasks',
          {
            guid: element.guid,
            id: element.id,
            title: element.title,
            description: element.description,
            completed: element.completed ? true : false,
            createdAt: element.created_at ? new Date(element.created_at) : null,
            updatedAt: element.updated_at ? new Date(element.updated_at) : null,
            completedAt: element.completed_at
              ? new Date(element.completed_at)
              : null,
            dueTime: element.dueTime ? new Date(element.dueTime) : null,
          },
          Realm.UpdateMode.All
        )
      })
      object.clients?.forEach((element) => {
        realmInstance.create(
          'Clients',
          {
            guid: element.guid,
            id: element.id,
            name: element.firstName,
            lastName: element.lastName,
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
            activityGuid: element.activityGuid,
            createdAt: element.created_at && new Date(element.created_at),
            updatedAt: element.updated_at && new Date(element.updated_at),
          },
          Realm.UpdateMode.All
        )
      })
    })
  } catch (e) {
    console.log(object)
    console.log(e)
  }
}
