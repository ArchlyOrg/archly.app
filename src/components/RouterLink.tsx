import type { LinkProps as DaisyLinkProperties } from 'react-daisyui'
import { Link as DaisyLink } from 'react-daisyui'
import type { LinkProps } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'

import type { ReactNode } from 'react'

export interface LinkProperties {
  href: string
  as?: React.ElementType
  children: ReactNode
  routerLinkProps?: LinkProps
  daisyProps?: DaisyLinkProperties
}
function RouterLink({
  href,
  as: LinkComponent = ReactRouterLink,
  routerLinkProps,
  children,
  daisyProps
}: LinkProperties): JSX.Element {
  const { replace, reloadDocument } = routerLinkProps as LinkProps

  return (
    <LinkComponent
      to={href}
      replace={replace as boolean}
      reloadDocument={reloadDocument as boolean}
    >
      <DaisyLink
        href={href}
        hover={daisyProps?.hover}
        color={daisyProps?.color}
      >
        {children}
      </DaisyLink>
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
  },
  daisyProps: {
    hover: true,
    href: '',
    color: 'ghost'
  }
}
