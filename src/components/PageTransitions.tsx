/* eslint-disable unicorn/no-null */
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

interface MainComponentProperties {
	routingPageOffset: number
	children: ReactNode
}
function MainComponent({
	routingPageOffset,
	children
}: MainComponentProperties): JSX.Element {
	const reference = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (reference.current) {
			const mainElement = reference.current.querySelector('main')
			if (mainElement) {
				mainElement.style.transform = `translateX(${routingPageOffset}px)`
			}
		}
	}, [reference, routingPageOffset])
	return (
		<div ref={reference} className='main-component relative'>
			{children}
		</div>
	)
}

function WipeTransition(): JSX.Element {
	const reference = useRef<HTMLDivElement>(null)
	return (
		<div
			ref={reference}
			className='
			wipe
			w-100
			fixed
			top-0
			left-0
			z-20
			h-screen
			translate-y-full
			bg-gray-700'
		/>
	)
}

interface PageTransitionsProperties {
	children: ReactNode
	route: string
	routingPageOffset: number
}
function PageTransitions({
	children,
	route,
	routingPageOffset
}: PageTransitionsProperties): JSX.Element {
	// const [inProperty, setInProperty] = useState(false)
	// const reference = useRef<HTMLDivElement>(null)

	return (
		<>
			<TransitionGroup component={null}>
				<CSSTransition key={route} classNames='page' timeout={600}>
					<MainComponent routingPageOffset={routingPageOffset}>
						{children}
					</MainComponent>
				</CSSTransition>
			</TransitionGroup>
			<WipeTransition />
		</>
	)
}

export default PageTransitions
