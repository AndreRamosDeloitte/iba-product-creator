import { useEffect, useState } from 'react'
import { CONTRACT_PERIODS } from '../constants'

const inputCls =
  'flex-1 min-w-0 px-2 py-1.5 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
const labelSpanCls = 'w-44 shrink-0 pr-3 text-sm'
const rowCls = 'flex items-center my-3'

export default function ProductForm() {
  const [riskCarriers, setRiskCarriers] = useState<Array<{ id: string; name: string }>>([])
  const [loadingCarriers, setLoadingCarriers] = useState(false)
  const [carriersError, setCarriersError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCarriers() {
      setLoadingCarriers(true)
      setCarriersError(null)
      try {
        const resp = await fetch('/api/parties?partyTypeName=Risk Carrier')
        if (!resp.ok) throw new Error('parties request failed')
        const json = await resp.json()
        const elements: Array<Record<string, unknown>> = Array.isArray(json)
          ? json
          : (json.elements ?? [])
        const parsed = elements.map((it) => {
          const partyData = it['partyData'] as Record<string, unknown> | undefined
          return {
            id: String(it['serial'] ?? ''),
            name: String(partyData?.['name'] ?? ''),
          }
        })
        setRiskCarriers(parsed)
      } catch (err: unknown) {
        setCarriersError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoadingCarriers(false)
      }
    }

    fetchCarriers()
  }, [])

  return (
    <div className="p-6 text-left">
      <h1 className="text-4xl font-medium mb-8">Create Product</h1>
      <form className="max-w-3xl">
        <fieldset className="border border-gray-300 p-4 rounded">
          <legend className="px-1.5 font-bold">Product</legend>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Product Type:</span>
            <select name="productType" className={inputCls}>
              <option value="">-- select --</option>
            </select>
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Name:</span>
            <input type="text" name="name" className={inputCls} />
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>Description:</span>
            <textarea name="description" rows={5} className={`${inputCls} resize-y`} />
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Commercial Name:</span>
            <input type="text" name="commercialName" className={inputCls} />
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>Commercial Description:</span>
            <textarea name="commercialDescription" rows={4} className={`${inputCls} resize-y`} />
          </label>

          <label className="flex items-center gap-2 my-3">
            <span className={labelSpanCls}>Prefer Commercial Name:</span>
            <input type="checkbox" name="preferCommercialName" className="w-4 h-4" />
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Line of Business:</span>
            <input type="text" name="lineOfBusiness" className={inputCls} />
          </label>

          <div className={rowCls}>
            <span className={labelSpanCls}>*Risk Carrier:</span>
            <div className="flex-1 min-w-0">
              <select name="riskCarrier" className="w-full px-2 py-1.5 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">-- select --</option>
                {loadingCarriers && <option value="">Loading...</option>}
                {riskCarriers.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {carriersError && <div className="text-red-500 text-xs mt-1">{carriersError}</div>}
            </div>
          </div>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Contract Period:</span>
            <select name="contractPeriod" className={inputCls}>
              <option value="">-- select --</option>
              {CONTRACT_PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Branch Code:</span>
            <input type="text" name="branchCode" className={inputCls} />
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Script Identifier:</span>
            <input type="text" name="scriptIdentifier" className={inputCls} />
          </label>

          <label className={rowCls}>
            <span className={labelSpanCls}>*Localization:</span>
            <select name="localization" className={inputCls}>
              <option value="">-- select --</option>
            </select>
          </label>

          <div className="flex items-center gap-4 my-3">
            <span className={labelSpanCls}>Validity:</span>
            <label className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Valid From:</span>
              <input
                type="date"
                name="validFrom"
                className="px-2 py-1.5 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Valid To:</span>
              <input
                type="date"
                name="validTo"
                className="px-2 py-1.5 border border-gray-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
