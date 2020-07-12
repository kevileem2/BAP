import { NavigationActions, NavigationParams } from 'react-navigation'

let navigator: any

function setTopLevelNavigator(navigatorRef: any) {
  navigator = navigatorRef
}

function navigate(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  )
}

const goBack = () => navigator.dispatch(NavigationActions.back())

export default {
  navigate,
  goBack,
  setTopLevelNavigator,
}
