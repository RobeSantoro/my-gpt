import React from 'react'

export default function Drawer() {
  return (
    <div className="drawer-side">
    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
    
    <div className="p-4 menu w-80 bg-base-100 text-base-content">

        <div className="collapse">
            <input type="checkbox" />
            <div className="text-xl font-medium collapse-title">
                Category One
            </div>
            <div className="collapse-content">
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            </div>
        </div>
        <div className="collapse">
            <input type="checkbox" />
            <div className="text-xl font-medium collapse-title">
                Category Two
            </div>
            <div className="collapse-content">
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            </div>
        </div>

    </div>

</div>
  )
}
