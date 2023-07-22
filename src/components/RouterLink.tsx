import type { ReactNode } from 'react'

import type { LinkProps } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'

export interface LinkProperties {
  href: string
  as?: React.ElementType
  children: ReactNode
  routerLinkProps?: LinkProps
}
function RouterLink({
  href,
  as: LinkComponent = ReactRouterLink,
  routerLinkProps,
  children
}: LinkProperties): JSX.Element {
  const { replace, reloadDocument } = routerLinkProps as LinkProps

  return (
    <LinkComponent
      to={href}
      replace={replace as boolean}
      reloadDocument={reloadDocument as boolean}
      // className={({ isActive }: { isActive: boolean }): string =>
      //   isActive ? 'border-b-slate-200' : ''
      // }
    >
      {children}
    </LinkComponent>
  )
}

export default RouterLink

RouterLink.defaultProps = {
  as: ReactRouterLink,
  routerLinkProps: {
    to: '',
    replace: false,
    reloadDocument: false
  }
}
