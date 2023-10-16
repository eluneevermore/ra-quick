import { cloneElement, useMemo, useContext, ReactElement } from 'react'
import PropTypes from 'prop-types'
import {
    sanitizeListRestProps,
    useListContext,
    useResourceContext,
    useResourceDefinition,
} from 'react-admin'
import { CreateButton, ExportButton, FilterButton, FilterContext, ListActionsProps, TopToolbar } from 'react-admin'

export const ExtListActions = (props: ExtListActionsProps) => {
    const { className, filters: filtersProp, hasCreate: _, actions, ...rest } = props
    const {
        sort,
        displayedFilters,
        filterValues,
        exporter,
        showFilter,
        total,
    } = useListContext(props)
    const resource = useResourceContext(props)
    const { hasCreate } = useResourceDefinition(props)
    const filters = useContext(FilterContext) || filtersProp
    return useMemo(
        () => (
            <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
                {filtersProp
                    ? cloneElement(filtersProp, {
                        resource,
                        showFilter,
                        displayedFilters,
                        filterValues,
                        context: 'button',
                    })
                    : filters && <FilterButton />}
                {actions}
                {hasCreate && <CreateButton />}
                {exporter !== false && (
                    <ExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={sort}
                        filterValues={filterValues}
                    />
                )}
            </TopToolbar>
        ),
        [
            actions,
            resource,
            displayedFilters,
            filterValues,
            filtersProp,
            showFilter,
            filters,
            total,
            className,
            sort,
            exporter,
            hasCreate,
        ]
    )
}

ExtListActions.propTypes = {
    className: PropTypes.string,
    sort: PropTypes.any,
    displayedFilters: PropTypes.object,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    onUnselectItems: PropTypes.func.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    showFilter: PropTypes.func,
    total: PropTypes.number,
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
}

ExtListActions.defaultProps = {
    selectedIds: [],
    onUnselectItems: () => null,
    actions: [],
}

export interface ExtListActionsProps extends ListActionsProps {
    actions: Array<ReactElement<any>> | ReactElement<any> | undefined | null,
}

export default ExtListActions
