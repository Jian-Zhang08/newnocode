import { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import './config-editor.css';

function ConfigEditor({ isOpen, onClose }) {
    const { config, updateConfig } = useConfig();
    const [tempConfig, setTempConfig] = useState(config);

    if (!isOpen) return null;

    const handleChange = (path, value) => {
        const newConfig = { ...tempConfig };
        const keys = path.split('.');
        let current = newConfig;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setTempConfig(newConfig);
    };

    const handleModuleToggle = (moduleId) => {
        const currentSelected = tempConfig.modules.selected || [];
        const newSelected = currentSelected.includes(moduleId)
            ? currentSelected.filter(id => id !== moduleId)
            : [...currentSelected, moduleId];

        handleChange('modules.selected', newSelected);
    };

    const handleSave = () => {
        updateConfig(tempConfig);
        onClose();
    };

    const handleReset = () => {
        setTempConfig(config);
    };

    return (
        <div className="config-editor-overlay">
            <div className="config-editor">
                <div className="config-editor-header">
                    <h2>App Configuration</h2>
                    <button className="config-editor-close" onClick={onClose}>×</button>
                </div>

                <div className="config-editor-content">
                    {/* Company Settings */}
                    <div className="config-section">
                        <h3>Company Settings</h3>
                        <div className="config-field">
                            <label>Company Name:</label>
                            <input
                                type="text"
                                value={tempConfig?.company?.name || ''}
                                onChange={(e) => handleChange('company.name', e.target.value)}
                            />
                        </div>
                        <div className="config-field">
                            <label>Display Name:</label>
                            <input
                                type="text"
                                value={tempConfig?.company?.displayName || ''}
                                onChange={(e) => handleChange('company.displayName', e.target.value)}
                            />
                        </div>
                        <div className="config-field">
                            <label>Powered By:</label>
                            <input
                                type="text"
                                value={tempConfig?.company?.poweredBy || ''}
                                onChange={(e) => handleChange('company.poweredBy', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Theme Settings */}
                    <div className="config-section">
                        <h3>Theme Settings</h3>
                        <div className="config-field">
                            <label>Primary Color:</label>
                            <input
                                type="color"
                                value={tempConfig?.theme?.primaryColor || '#4A90E2'}
                                onChange={(e) => handleChange('theme.primaryColor', e.target.value)}
                            />
                        </div>
                        <div className="config-field">
                            <label>Secondary Color:</label>
                            <input
                                type="color"
                                value={tempConfig?.theme?.secondaryColor || '#2c3e50'}
                                onChange={(e) => handleChange('theme.secondaryColor', e.target.value)}
                            />
                        </div>
                        <div className="config-field">
                            <label>Background Color:</label>
                            <input
                                type="color"
                                value={tempConfig?.theme?.backgroundColor || '#f5f5f5'}
                                onChange={(e) => handleChange('theme.backgroundColor', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Module Settings */}
                    <div className="config-section">
                        <h3>Available Modules</h3>
                        <div className="config-modules">
                            {tempConfig?.modules?.available?.map((module) => (
                                <div key={module.id} className="config-module">
                                    <label className="config-module-label">
                                        <input
                                            type="checkbox"
                                            checked={tempConfig.modules.selected?.includes(module.id) || false}
                                            onChange={() => handleModuleToggle(module.id)}
                                            disabled={module.required}
                                        />
                                        <span className="config-module-icon">{module.icon}</span>
                                        <span className="config-module-name">{module.name}</span>
                                        {module.required && <span className="config-module-required">(Required)</span>}
                                    </label>
                                    <p className="config-module-description">{module.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="config-editor-actions">
                    <button className="config-btn config-btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                    <button className="config-btn config-btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfigEditor;
