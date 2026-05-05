import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Copy, Check, Plus, UserPlus, LogIn } from 'lucide-react';

const Groups = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('my');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [joinCode, setJoinCode] = useState('');

  // Mock groups data
  const [groups, setGroups] = useState([
    {
      _id: 'g1',
      name: 'Physics Class 12-A',
      description: 'All physics students of section A',
      inviteCode: 'PH12A1',
      creator: { name: 'Dr. Sharma' },
      members: [{ name: 'Aarav' }, { name: 'Priya' }, { name: 'Rohan' }, { name: 'Sneha' }],
    },
    {
      _id: 'g2',
      name: 'Math Olympiad Prep',
      description: 'Preparation group for upcoming math olympiad',
      inviteCode: 'MATH01',
      creator: { name: 'Prof. Gupta' },
      members: [{ name: 'Aarav' }, { name: 'Vikram' }],
    }
  ]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateGroup = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroups([...groups, {
      _id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      inviteCode: code,
      creator: { name: user?.name || 'You' },
      members: [{ name: user?.name || 'You' }]
    }]);
    setNewGroup({ name: '', description: '' });
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Study Groups</h1>
          <p className="mt-1 text-slate-500">Manage your learning groups and collaborate with peers.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowJoinModal(true)}
            className="flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Join Group
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No groups yet</h3>
            <p className="text-slate-500 mb-6">Create or join a group to get started.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{group.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{group.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                      {group.members.length} members
                    </div>
                    <div className="text-sm text-slate-500">
                      Created by <span className="font-medium text-slate-700">{group.creator.name}</span>
                    </div>
                  </div>
                  
                  {/* Members Avatars */}
                  <div className="flex items-center mt-4">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 5).map((member, idx) => (
                        <div 
                          key={idx}
                          className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-600"
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {group.members.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                          +{group.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Invite Code */}
                <div className="ml-6 text-right flex-shrink-0">
                  <p className="text-xs font-medium text-slate-500 mb-1">Invite Code</p>
                  <button
                    onClick={() => handleCopyCode(group.inviteCode)}
                    className="flex items-center bg-slate-100 hover:bg-slate-200 rounded-lg px-3 py-2 font-mono text-sm font-bold text-slate-700 transition-colors"
                  >
                    {group.inviteCode}
                    {copiedCode === group.inviteCode ? (
                      <Check className="w-4 h-4 ml-2 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 ml-2 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g. Physics Class 12-A"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  placeholder="What's this group about?"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                <button onClick={handleCreateGroup} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">Create Group</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Join a Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Enter Invite Code</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-center font-mono text-lg uppercase"
                  placeholder="XXXXXX"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowJoinModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                <button onClick={() => setShowJoinModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
