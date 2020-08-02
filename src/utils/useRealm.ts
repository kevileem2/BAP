import { useContext, useEffect, useState } from 'react'
import { RealmContext } from '../App'

interface RealmConfigObject {
  object: string
  name: string
  doNotListenForChanges?: boolean
  query?: string
}

const missingInstanceError = 'Realm instance missing from context'

export default function useRealm<ObjectsType>(
  objectsConfig: RealmConfigObject[]
) {
  const realm = useContext(RealmContext)
  const [objects, setObjects] = useState<Partial<ObjectsType>>({})

  useEffect(() => {
    if (!realm) {
      throw missingInstanceError
    }

    const objectsWithListeners: Realm.Results<Realm.Object>[] = []
    const realmObjects = objectsConfig.reduce<Partial<ObjectsType>>(
      (accumulator, { object, name, doNotListenForChanges, query }) => {
        const realmObject = query
          ? realm.objects(object).filtered(query)
          : realm.objects(object)

        if (!doNotListenForChanges) {
          realmObject.addListener((newObject) => {
            setObjects((currentObjects) => ({
              ...currentObjects,
              [name]: newObject,
            }))
            objectsWithListeners.push(realmObject)
          })
        }
        return {
          ...accumulator,
          [name]: realmObject,
        }
      },
      {}
    )
    setObjects(realmObjects)

    return () => {
      objectsWithListeners.forEach((item) => {
        item.removeAllListeners()
      })
    }
  }, [])

  const write = (writeAction: (realm: Realm) => void) => {
    if (!realm) {
      throw missingInstanceError
    }
    try {
      realm.write(() => {
        writeAction(realm)
      })
    } catch (error) {
      throw error
    }
  }

  const deleteObject = (object: Realm.Object) => {
    if (!realm) {
      throw missingInstanceError
    }
    realm.write(() => {
      realm.delete(object)
    })
  }

  const fetchData = () => {
    if (!realm) {
      throw missingInstanceError
    }
    setObjects(
      objectsConfig.reduce<Partial<ObjectsType>>(
        (accumulator, { object, name }) => ({
          ...accumulator,
          [name]: realm.objects(object),
        }),
        {}
      )
    )
  }

  const getObject: <T>(name: string) => Realm.Results<T> = (name) => {
    if (!realm) {
      throw missingInstanceError
    }
    return realm.objects(name)
  }

  return { objects, write, deleteObject, fetchData, getObject }
}
