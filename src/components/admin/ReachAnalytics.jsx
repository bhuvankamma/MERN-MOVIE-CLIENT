import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F'];

const ReachAnalytics = () => {
  const [viewsData, setViewsData] = useState([]);
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/admin/analytics'); // You can set up this backend route
        setViewsData(data.viewsOverTime);
        setRatingsData(data.ratingDistribution);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="shadow-md p-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">📈 Views Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={viewsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md p-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">⭐ Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ratingsData} dataKey="value" nameKey="rating" cx="50%" cy="50%" outerRadius={80} label>
                {ratingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReachAnalytics;
